import { useEffect, useState } from "react";
import { AllergenVM } from "../../models/allergenModels";
import { Button, Card, CardActionArea, CardContent, Grid, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
export default function AllergenSelectionView() {
    const [allergens, setAllergens] = useState<AllergenVM[]>([]);
    const authToken = localStorage.getItem('authToken');
    const [needRefresh, setNeedRefresh] = useState<boolean>(false);
    const [selectedAllergenIDs, setSelectedAllergenIDs] = useState<string[]>([]);

    useEffect(() => {
        axios
            .get(`${baseUrl()}Allergen/Selected`, { headers: { 'Authorization': `Bearer ${authToken}` } })
            .then((res) => {
                if (res.status === 200) {
                    setAllergens(res.data);
                    setSelectedAllergenIDs(
                        res.data
                            .filter((a: AllergenVM) => a.selected === true)
                            .map((a: AllergenVM) => a.idAllergen.toString())
                    );
                    setNeedRefresh(false);
                } else {
                    console.error(res.statusText);
                }
            })
            .catch((err) => console.error(err))
    }, [authToken, needRefresh])

    const handleClick = (idAllergen: string) => {
        if (selectedAllergenIDs.includes(idAllergen)) {
            setSelectedAllergenIDs(selectedAllergenIDs.filter(id => id !== idAllergen));
        } else {
            setSelectedAllergenIDs([...selectedAllergenIDs, idAllergen]);
        }
    }

    const handleSelected = () => {
        axios
            .post(`${baseUrl()}Allergen/Select`, selectedAllergenIDs, { headers: { 'Authorization': `Bearer ${authToken}` } })
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
                    <Button onClick={handleSelected} variant="contained" endIcon={<EditIcon />}>Update allergens</Button>
                </Grid>
                {allergens && allergens.map((allergen) => (
                    <Grid key={allergen.idAllergen} item lg={3} md={4} xs={12} sm={6}>
                        <CardActionArea data-key={allergen.idAllergen} className={selectedAllergenIDs.includes(allergen.idAllergen.toString()) ? "selected-card" : ""} key={allergen.idAllergen} onClick={() => handleClick(allergen.idAllergen.toString())}>
                            <Card id="selection-card" key={allergen.idAllergen} sx={{ textAlign: "center", padding: "4rem 0" }}>
                                <CardContent key={allergen.idAllergen}>
                                    <Tooltip title={allergen.description}>
                                        <Typography key={allergen.idAllergen} variant="h3">{allergen.name}</Typography>
                                    </Tooltip>
                                </CardContent>
                            </Card>
                        </CardActionArea>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

