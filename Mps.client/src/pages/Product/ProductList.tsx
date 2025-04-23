import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Pagination, Select, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import baseUrl from "../../utils/baseUrl";
import axios from "axios";
import { UnitVM } from "../../models/unitModels";
import { useDropzone } from 'react-dropzone'
import { Product, ProductNavigation } from "../../models/productModels";
import { CategoryVM } from "../../models/categoryModels";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchIcon from '@mui/icons-material/Search';
import ProgressCircle from "../../components/ProgressCircle";
import ScannerDialog from "../../components/ScannerDialog";
import ProductCard from "../../components/ProductCard";
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import DeleteIcon from '@mui/icons-material/Delete';

interface FileWithPreview extends File {
    preview: string;
}

export default function ProductList() {
    const [open, setOpen] = useState<boolean>(false);
    const [units, setUnits] = useState<UnitVM[]>([]);
    const [unit, setUnit] = useState<number>(1);
    const [categories, setCategories] = useState<CategoryVM[]>([]);
    const [category, setCategory] = useState<number[]>([1]);
    const [products, setProducts] = useState<Product[]>([]);
    const [product, setProduct] = useState<Product>(new Product());
    const authToken = localStorage.getItem('authToken');
    const [files, setFiles] = useState<FileWithPreview[]>([]);
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
    const [openScannerDialog, setOpenScannerDialog] = useState<boolean>(false);
    const [categoryFilter, setCategoryFilter] = useState<number[]>([]);
    const [expirationDateFromFilter, setExpirationDateFromFilter] = useState<Dayjs | null>(dayjs().add(-3, 'day'));
    const [expirationDateToFilter, setExpirationDateToFilter] = useState<Dayjs | null>(dayjs().add(3, 'day'));
    const [filterText, setFilterText] = useState<string>("");
    const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
    const [rowsPerPage, setRowsPerPage] = useState<number>(9);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [quantityError, setQuantityError] = useState<boolean>(false);
    const [addManually, setAddManually] = useState<boolean>(false);

    const indexOfLastProduct = currentPage * rowsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
    const currentProducts = products.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );

    const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number): void => {
        setCurrentPage(value);
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const thumbs = files.length > 0 ? files.map(file => (
        <div key={file.name}>
            <div>
                <img
                    className="thumbnail"
                    src={file.preview}
                    onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />
            </div>
        </div>
    )) : "";

    useEffect(() => {
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    useEffect(() => {
        axios
            .get(`${baseUrl()}Unit`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then((res) => {
                if (res.status === 200)
                    setUnits(res.data)
                else
                    console.error(res.statusText);
            })
            .catch(err => console.error(err));

        axios
            .get(`${baseUrl()}Category`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then((res) => {
                if (res.status === 200)
                    setCategories(res.data)
                else
                    console.error(res.statusText);
            })
            .catch(err => console.error(err));

        axios
            .get(`${baseUrl()}Product`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then((res) => {
                setNeedRefresh(false);
                if (res.status === 200) {
                    if (categoryFilter.length > 0 && expirationDateFromFilter !== null && expirationDateToFilter !== null) {
                        setProducts(
                            res.data.filter((pr: { expirationDate: Date; categories: number[]; idProductNavigation: ProductNavigation }) =>
                                pr.categories.some(catId => categoryFilter.includes(catId)) &&
                                dayjs(pr.expirationDate) >= expirationDateFromFilter &&
                                dayjs(pr.expirationDate) <= expirationDateToFilter
                                && pr.idProductNavigation.title.toLowerCase().includes(filterText.toLowerCase())
                            )
                        );
                    } else if (expirationDateFromFilter !== null && expirationDateToFilter !== null) {
                        setProducts(
                            res.data.filter((pr: { expirationDate: Date; title: string; idProductNavigation: ProductNavigation }) =>
                                dayjs(pr.expirationDate) >= expirationDateFromFilter &&
                                dayjs(pr.expirationDate) <= expirationDateToFilter
                                && pr.idProductNavigation.title.toLowerCase().includes(filterText.toLowerCase())
                            )
                        );
                    } else {
                        setProducts(res.data);
                    }
                }
                else
                    console.error(res.statusText);
            })
            .catch(err => console.error(err));
    }, [authToken, categoryFilter, expirationDateFromFilter, expirationDateToFilter, filterText, needRefresh])

    const handleAddClick = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        if (Number(formData.get('quantity')) < 1) {
            setQuantityError(true);
            toast.error("Quantity must be greater than zero");
            return;
        }

        formData.delete('category');
        category.forEach((item) => formData.append("category[]", String(item)));
        formData.append('unit', String(unit));
        if (files.length > 0) {
            formData.append('image', files[0]);
        }
        const title = formData.get('title');

        if (!addManually) {
            axios.get(`https://api.api-ninjas.com/v1/nutrition?query=${title}`, {
                headers: {
                    'X-Api-Key': import.meta.env.VITE_NUTRITION_API_KEY
                }
            })
                .then((resp) => {
                    if (resp.status === 200 && resp.data[0] !== undefined) {
                        const nutritionData = resp.data[0];
                        formData.set('calories', Intl.NumberFormat('lt-LT').format(nutritionData.calories));
                        formData.set('fat', Intl.NumberFormat('lt-LT').format(nutritionData.fat_total_g));
                        formData.set('protein', Intl.NumberFormat('lt-LT').format(nutritionData.protein_g));
                        formData.set('carbs', Intl.NumberFormat('lt-LT').format(nutritionData.carbohydrates_total_g));
                        return formData;
                    } else {
                        toast.error("Nutrition information not found. Please add the information manually");
                    }
                })
                .then((formData) => {
                    const apiUrl = product.idProductNavigation.idProduct > 0 ? `${baseUrl()}Product/${product.idProductNavigation.idProduct}` : `${baseUrl()}Product`;
                    const method = product.idProductNavigation.idProduct > 0 ? 'put' : 'post';
                    return axios({
                        method: method,
                        url: apiUrl,
                        data: formData,
                        headers: {
                            'Authorization': `Bearer ${authToken}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                })
                .then((resp) => {
                    if (resp.status === 200) {
                        setNeedRefresh(true);
                        setOpen(false);
                        const message = product.idProductNavigation.idProduct > 0 ? "Product was successfully updated" : "Product was successfully added";
                        toast.success(message);
                    } else {
                        throw new Error("Error: " + resp.statusText);
                    }
                })
                .catch((error) => {
                    console.error('Error making API request:', error);
                    toast.error(error.message);
                });
        }
        else {
            const apiUrl = product.idProductNavigation.idProduct > 0 ? `${baseUrl()}Product/${product.idProductNavigation.idProduct}` : `${baseUrl()}Product`;
            const method = product.idProductNavigation.idProduct > 0 ? 'put' : 'post';
            axios({
                method: method,
                url: apiUrl,
                data: formData,
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((resp) => {
                    if (resp.status === 200) {
                        setNeedRefresh(true);
                        setOpen(false);
                        const message = product.idProductNavigation.idProduct > 0 ? "Product was successfully updated" : "Product was successfully added";
                        toast.success(message);
                    } else {
                        throw new Error("Error: " + resp.statusText);
                    }
                })
                .catch((error) => {
                    console.error('Error making API request:', error);
                    toast.error(error.message);
                });
        }

    }

    const handleEditOpenClick = (product: Product) => {
        setQuantityError(false);
        setFiles([]);
        setProduct(product);
        setOpen(true);
        setCategory(product.categories);
    }

    const handleDeleteClick = (product: Product) => {
        setProduct(product);
        setOpenConfirmation(true);
    }

    const handleDeleteConfirmation = () => {
        axios
            .delete(`${baseUrl()}Product/${product.idProductNavigation.idProduct}`,
                { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                setOpenConfirmation(false);
                if (resp.status === 200) {
                    setNeedRefresh(true);
                    toast.success("Product was succesfully deleted");
                }
                else {
                    toast.error("Error:" + resp.statusText);
                }
            })
            .catch((error) => console.error('Error making API request:', error))
    }

    const handleReceiptUpload = async () => {
        setOpenBackdrop(true);
        const formData = new FormData();
        formData.append('receipt', files[0]);
        axios
            .post(`${baseUrl()}Receipt`, formData, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                setOpenBackdrop(false);
                if (res.status === 200) {
                    setNeedRefresh(true);
                    setOpenScannerDialog(false);
                    toast.success("Products have been succesfully added");
                }
                else {
                    toast.error("Internal error while saving products. Please try again.");
                    console.error(res.statusText);
                }
            })
            .catch(err => {
                setOpenBackdrop(false);
                console.error(err);
                toast.error("Internal error while saving products. Please try again.");
            });
    };

    return (
        <>
            <ToastContainer />
            <ProgressCircle message="Adding products..." openBackdrop={openBackdrop} />
            <Dialog
                open={openConfirmation}
                onClose={() => setOpenConfirmation(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Do you really want to delete this product?
                </DialogTitle>
                <DialogActions>
                    <Button endIcon={<CloseIcon />} onClick={() => setOpenConfirmation(false)}>Disagree</Button>
                    <Button endIcon={<DeleteIcon />} color="error" onClick={handleDeleteConfirmation} autoFocus>
                        Agree
                    </Button>
                </DialogActions>
            </Dialog>
            <ScannerDialog
                open={openScannerDialog}
                onClose={() => setOpenScannerDialog(false)}
                product={product}
                thumbs={thumbs}
                files={files}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                handleReceiptUpload={handleReceiptUpload}
            />
            <Box marginTop="1rem" display="flex" justifyContent="center">
                <Pagination
                    color="secondary"
                    count={Math.ceil(
                        products.length / rowsPerPage
                    )}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </Box>
            <Grid container style={{ width: '100%', marginTop: "1rem" }}>
                <Grid spacing={1} container sx={{ width: "20%", height: '100px' }}>
                    <Grid item xs={12}>
                        <Button sx={{ minWidth: "200px", width: 'auto' }} onClick={() => { setOpen(true); setFiles([]); setProduct(new Product()); setCategory([1, 2]) }} variant="contained" endIcon={<AddIcon />}>Add a product</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button sx={{ minWidth: "200px", width: 'auto' }} onClick={() => { setOpenScannerDialog(true); setFiles([]); setProduct(new Product()) }} variant="contained" endIcon={<DocumentScannerIcon />}>Scan receipt</Button>
                    </Grid>
                </Grid>
                <Grid spacing={1} container sx={{ width: "60%" }}>
                    {currentProducts && currentProducts.map((product) => (
                        <Grid marginBottom="1rem" item xs={12} md={6} lg={4}>
                            <ProductCard
                                product={product}
                                handleEditOpenClick={handleEditOpenClick}
                                handleDeleteClick={handleDeleteClick}
                            />
                        </Grid>
                    ))
                    }
                </Grid>
                { /*Filter table*/}
                <Box
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    width="17%"
                    bgcolor="white"
                    borderRadius="4px"
                    padding="2rem"
                    maxHeight="400px"
                >
                    <Typography color="black" textAlign="center" variant="h4">
                        Filters
                    </Typography>
                    <FormControl fullWidth>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <SearchIcon />
                                ),
                            }}
                            style={{ textAlign: 'center' }}
                            margin="normal"
                            onChange={(e) => (setFilterText(e.target.value))}
                            id="standard-basic"
                            variant="standard"
                            placeholder="Search..."
                        />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="category-label">Select categories</InputLabel>
                        {categories.length > 0 &&
                            <Select
                                multiple
                                labelId="category-label"
                                label="category"
                                id="categoryFilter"
                                variant="standard"
                                name="categoryFilter"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value as unknown as number[])}
                            >
                                {
                                    categories.map((category) => (
                                        <MenuItem key={category.idCategory} value={category.idCategory}>{category.title}</MenuItem>
                                    )
                                    )
                                }
                            </Select>
                        }
                    </FormControl>
                    <br />
                    <FormControl margin="normal">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={expirationDateFromFilter}
                                onChange={(e) => setExpirationDateFromFilter(e)}
                                label="Expiration date from" name="expirationDateFrom" format="YYYY-MM-DD"
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <FormControl margin="normal">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                value={expirationDateToFilter}
                                onChange={(e) => setExpirationDateToFilter(e)}
                                label="Expiration date to" name="expirationDateTo" format="YYYY-MM-DD"
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <FormControl margin="dense" fullWidth>
                        <InputLabel id="page-size-label">Rows per page</InputLabel>
                        <Select
                            size="small"
                            variant="standard"
                            labelId="page-size-label"
                            id="page-size-select"
                            value={rowsPerPage}
                            label="Page size"
                            onChange={(e) => setRowsPerPage(Number(e.target.value))}
                        >
                            <MenuItem value={9}>9</MenuItem>
                            <MenuItem value={18}>18</MenuItem>
                            <MenuItem value={27}>27</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Grid>
            <Box marginTop="1rem" display="flex" justifyContent="center">
                <Pagination
                    color="secondary"
                    count={Math.ceil(
                        products.length / rowsPerPage
                    )}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </Box>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleAddClick,
                }}
            >
                <DialogTitle>{product.idProductNavigation.idProduct > 0 ? "Edit product" : "Add a product"}</DialogTitle>
                <DialogContent>
                    <InputLabel id="image-label">Image</InputLabel>
                    <section className="container">
                        <div  {...getRootProps({ className: 'dropzone dropzone-border' })}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                        <aside>
                            {thumbs}
                            {
                                files.length === 0 && product.idProductNavigation.image !== ""
                                    ? <img className="thumbnail"
                                        src=
                                        {
                                            product.idProductNavigation.image === null || product.idProductNavigation.image === ""
                                                ? '/product.svg'
                                                : '/Uploads/' + product.idProductNavigation.image
                                        }
                                    />
                                    : <></>
                            }
                        </aside>
                    </section>
                    <TextField
                        margin="dense"
                        autoFocus
                        required
                        id="title"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue=
                        {
                            product.idProductNavigation.idProduct > 0
                                ? product.idProductNavigation.title
                                : ""
                        }
                        inputProps={{ maxLength: "100" }}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="note"
                        name="note"
                        label="Note"
                        type="text"
                        multiline
                        fullWidth
                        variant="standard"
                        defaultValue=
                        {
                            product.idProductNavigation.idProduct > 0
                                ? product.note
                                : ""
                        }
                        inputProps={{ maxLength: "255" }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <TextField
                            margin="dense"
                            required
                            id="quantity"
                            name="quantity"
                            label="Quantity"
                            type="number"
                            variant="standard"
                            sx={{
                                "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                    appearance: 'none'
                                },
                                maxWidth: "100px"
                            }}
                            defaultValue=
                            {
                                product.idProductNavigation.idProduct > 0
                                    ? product.quantity
                                    : 0
                            }
                            inputProps={{ min: '0', max: '10000' }}
                            error={quantityError}
                            onChange={() => setQuantityError(false)}
                        />
                        <FormControl sx={{ maxWidth: '120px' }} margin="dense">
                            <InputLabel id="unit-label">Unit&nbsp;*</InputLabel>
                            {units.length > 0 && (
                                <Select
                                    labelId="unit-label"
                                    id="unit"
                                    variant="standard"
                                    name="unit"
                                    defaultValue=
                                    {
                                        product.idProductNavigation.idProduct > 0
                                            ? product.measurementUnit
                                            : units[0].idMeasurementUnits
                                    }
                                    onChange={(e) => setUnit(Number(e.target.value))}
                                >
                                    {units.map((unit) => (
                                        <MenuItem key={unit.idMeasurementUnits} value={unit.idMeasurementUnits}>{unit.name}</MenuItem>
                                    ))}
                                </Select>
                            )}
                        </FormControl>
                        <FormControl sx={{ width: '230px', marginLeft: '1rem' }} margin="dense">
                            <InputLabel id="category-label">Category&nbsp;*</InputLabel>
                            {categories.length > 0 &&
                                <Select
                                    required
                                    multiple
                                    labelId="category-label"
                                    label="category"
                                    id="category"
                                    variant="standard"
                                    name="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as unknown as number[])}
                                >
                                    {
                                        categories.map((category) => (
                                            <MenuItem key={category.idCategory} value={category.idCategory}>{category.title}</MenuItem>
                                        )
                                        )
                                    }
                                </Select>
                            }
                        </FormControl>
                    </div>
                    <FormControl fullWidth margin="normal">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker defaultValue=
                                {
                                    product.idProductNavigation.idProduct > 0
                                        ? dayjs(product.expirationDate)
                                        : dayjs(new Date())
                                }
                                label="Expiration date" name="expirationDate" format="YYYY-MM-DD"
                            />
                        </LocalizationProvider>
                    </FormControl>
                    <Divider />
                    <Typography variant="h6">
                        Nutrition information (100g)
                    </Typography>
                    <FormControlLabel control={<Checkbox onChange={(e) => setAddManually(e.target.checked)} checked={addManually} />} label="Add nutrition information manually" />
                    <br />
                    <TextField
                        margin="dense"
                        required
                        id="calories"
                        name="calories"
                        label="Calories, kcal"
                        type="number"
                        variant="standard"
                        sx={{
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                appearance: 'none'
                            },
                            maxWidth: "100px",
                            mr: "1rem"
                        }}
                        defaultValue=
                        {
                            product.idProductNavigation.idProduct > 0
                                ? product.idProductNavigation.calories
                                : 0
                        }
                        disabled={!addManually}
                        inputProps={{ min: '1' }}
                    />
                    <TextField
                        margin="dense"
                        required
                        id="Carbs"
                        name="carbs"
                        label="Carbs, g"
                        type="number"
                        variant="standard"
                        sx={{
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                appearance: 'none'
                            },
                            maxWidth: "100px",
                            mr: "1rem"
                        }}
                        defaultValue=
                        {
                            product.idProductNavigation.idProduct > 0
                                ? product.idProductNavigation.carbs
                                : 0
                        }
                        disabled={!addManually}
                        inputProps={{ min: '1' }}
                    />
                    <TextField
                        margin="dense"
                        required
                        id="Fat"
                        name="fat"
                        label="Fat, g"
                        type="number"
                        variant="standard"
                        sx={{
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                appearance: 'none'
                            },
                            maxWidth: "100px",
                            mr: "1rem"
                        }}
                        defaultValue=
                        {
                            product.idProductNavigation.idProduct > 0
                                ? product.idProductNavigation.fat
                                : 0
                        }
                        disabled={!addManually}
                        inputProps={{ min: '1' }}
                    />
                    <TextField
                        margin="dense"
                        required
                        id="Protein"
                        name="protein"
                        label="Protein, g"
                        type="number"
                        variant="standard"
                        sx={{
                            "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
                                appearance: 'none'
                            },
                            maxWidth: "100px",
                            mr: "1rem"
                        }}
                        defaultValue=
                        {
                            product.idProductNavigation.idProduct > 0
                                ? product.idProductNavigation.protein
                                : 0
                        }
                        disabled={!addManually}
                        inputProps={{ min: '1' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button endIcon={<CloseIcon />} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button endIcon={product.idProductNavigation.idProduct > 0 ? <DoneIcon /> : <AddIcon />} sx={{ color: '#FFA500' }} type="submit">{product.idProductNavigation.idProduct > 0 ? "Update" : "Add"}</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}