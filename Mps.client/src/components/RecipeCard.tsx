import { RecipeVM } from "../models/recipeModels";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";
import ArticleIcon from '@mui/icons-material/Article';
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


export default function RecipeCard({ recipe }: { recipe: RecipeVM }) {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDetailsClick = (spoonacularId: number) => {
        navigate(`/recipe/${spoonacularId}`);
    }

    return (
        <Card id="selection-card" sx={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: 350 }}>
            <CardHeader
                sx={{ height: '100px' }}
                title={recipe.title}
            />
            <CardMedia
                component="img"
                height="194"
                image={recipe.image}
                alt="Paella dish"
            />
            <CardContent>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                    {
                        recipe
                            .nutrition
                            .nutrients
                            .filter(x => x.name === "Protein"
                                || x.name === "Calories"
                                || x.name === "Carbohydrates"
                                || x.name === "Fat")
                            .map((nutrient) => (
                                <Typography key={nutrient.name} variant="body2">
                                    <span style={{ fontSize: "medium" }}>{nutrient.name}</span>
                                    <br />{nutrient.amount}&nbsp;{nutrient.unit}
                                </Typography>
                            ))
                    }
                </div>
            </CardContent>
            <CardActions sx={{ marginTop: 'auto', justifyContent: 'space-between' }}>
                <IconButton onClick={() => handleDetailsClick(recipe.id)} title="Details" aria-label="view details">
                    <ArticleIcon />
                </IconButton>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ display: 'flex', flexDirection: 'row' }}>
                    {
                        recipe.glutenFree
                        &&
                        <Tooltip title="Gluten free">
                            <img className="recipe-card-icon" src="/gluten-free.png" />
                        </Tooltip>
                    }
                    {
                        recipe.dairyFree
                        &&
                        <Tooltip title="Dairy free">
                            <img className="recipe-card-icon" src="/dairy-free.png" />
                        </Tooltip>
                    }
                    {
                        recipe.vegan
                        &&
                        <Tooltip title="Vegan">
                            <img className="recipe-card-icon" src="/vegan.png" />
                        </Tooltip>
                    }
                    {
                        recipe.sustainable
                        &&
                        <Tooltip title="Sustainable">
                            <img className="recipe-card-icon" src="/sustainable.png" />
                        </Tooltip>
                    }
                    <div style={{ flex: 1 }} />
                </CardContent>
            </Collapse>
        </Card>

    );
}