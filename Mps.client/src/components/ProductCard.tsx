import { Card, CardMedia, CardContent, CardActions, Typography, IconButton } from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Product } from '../models/productModels';
import getMeasurementUnit from '../utils/measurementUnitConverter';
import getDaysLeft from '../utils/DaysLeft';

interface ProductCardProps {
    product: Product;
    handleEditOpenClick: (product: Product) => void;
    handleDeleteClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    handleEditOpenClick,
    handleDeleteClick
}) => {
    return (
        <Card id="selection-card" sx={{ maxWidth: 345 }}>
            <CardMedia
                sx={{ height: 140 }}
                image={
                    product.idProductNavigation.image === null || product.idProductNavigation.image === ""
                        ? '/product.svg'
                        : '/Uploads/' + product.idProductNavigation.image
                }
                title="food product"
            />
            <CardContent>
                <Typography className="product-title" gutterBottom variant="h5" component="div">
                    {product.idProductNavigation.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" component="div">
                    Quantity:&nbsp;{product.quantity}&nbsp;{getMeasurementUnit(product.measurementUnit)}
                </Typography>
                <Typography
                    variant="body1"
                    color={new Date(product.expirationDate) < new Date() ? "error" : "green"}
                    component="div"
                    display="flex"
                    alignItems="center"
                >
                    <CalendarMonthIcon />&nbsp;{product.expirationDate.toString()}&nbsp;({getDaysLeft({expirationDate : product.expirationDate})}&nbsp;days)
                </Typography>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <IconButton onClick={() => handleEditOpenClick(product)} title="Details" aria-label="view details">
                    <ArticleIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(product)} aria-label="delete">
                    <DeleteIcon color="error" />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default ProductCard;