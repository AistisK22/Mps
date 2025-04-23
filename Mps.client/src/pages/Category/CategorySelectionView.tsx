import { useEffect, useState } from "react";
import { Button, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import { CategoryVM } from "../../models/categoryModels";
export default function CategorySelectionView() {
    const [categories, setCategories] = useState<CategoryVM[]>([]);
    const authToken = localStorage.getItem('authToken');
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const [selectedCategoryIDs, setSelectedCategoryIDs] = useState<string[]>([]);

    useEffect(() => {
        axios
            .get(`${baseUrl()}Category/Selected`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((res) => {
                if (res.status === 200) {
                    setCategories(res.data);
                    setSelectedCategoryIDs(res.data.filter((c: CategoryVM) => c.selected === true).map((c: CategoryVM) => c.idCategory.toString()));
                    setNeedRefresh(false);
                } else {
                    console.error(res.statusText);
                }
            })
            .catch((err) => console.error(err))
    }, [authToken, needRefresh])

    const handleClick = (idCategory: string) => {
        if (selectedCategoryIDs.includes(idCategory)) {
            setSelectedCategoryIDs(selectedCategoryIDs.filter(id => id !== idCategory));
        } else {
            setSelectedCategoryIDs([...selectedCategoryIDs, idCategory]);
        }
    }

    const handleSelected = () => {
        axios
            .post(`${baseUrl()}Category/Select`, selectedCategoryIDs, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((resp) => {
                if (resp.status === 200) {
                    toast.success("Successfully updated");
                    setNeedRefresh(true);
                } else {
                    toast.error("Backend error");
                    console.error(resp.statusText);
                }
            })
            .catch((err) => console.error(err));
    }

    return (
        <div style={{ justifyContent: 'center', display: 'flex', marginTop: '2rem' }}>
            <ToastContainer />
            <Grid maxWidth="75%" container spacing={4}>
                <Grid item xs={12}>
                    <Button onClick={handleSelected} variant="contained" endIcon={<EditIcon />}>Update categories</Button>
                </Grid>
                {categories && categories.map((category) => (
                    <Grid key={category.idCategory} item lg={3} md={4} xs={12} sm={6}>
                        <CardActionArea data-key={category.idCategory} className={selectedCategoryIDs.includes(category.idCategory.toString()) ? "selected-card" : ""} key={category.idCategory} onClick={() => handleClick(category.idCategory.toString())}>
                            <Card id="selection-card" key={category.idCategory} sx={{ textAlign: "center", padding: "4rem 0", minHeight: '300px', display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                                <CardContent key={category.idCategory}>
                                    <Typography key={category.idCategory} variant="h3">{category.title}</Typography>
                                </CardContent>
                            </Card>
                        </CardActionArea>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

