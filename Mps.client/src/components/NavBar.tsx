import { AppBar, Toolbar, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { isUserAdmin, isUserLoggedIn } from '../pages/Auth/AuthUtils';
import { useNavigate } from 'react-router';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import NoMealsIcon from '@mui/icons-material/NoMeals';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ListAltIcon from '@mui/icons-material/ListAlt';
import KitchenIcon from '@mui/icons-material/Kitchen';
import ChecklistIcon from '@mui/icons-material/Checklist';
export default function NavBar() {
    const location = useLocation();
    const shouldShowAppBar = location.pathname !== "/Register" && location.pathname !== "/Login";
    const navigate = useNavigate();

    const Logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("isAdmin");
        localStorage.setItem("InfoMessage", "Succesfully logged out");
        navigate("/Login");
    }


    return shouldShowAppBar ? (
        <AppBar sx={{ backgroundColor: "white" }} position="static">
            <Toolbar>
                <Link to={isUserAdmin() ? "/User" : "/"}>
                    <img className="logo" src="/mps2.png" alt="Logo" />
                </Link>
                &nbsp;
                {isUserLoggedIn() &&
                    <>
                        {isUserAdmin()
                            ?
                            <>
                                <Link to="/Allergen">
                                <Button sx={{ color: '#4285F4' }} startIcon={<NoMealsIcon />}>Allergens</Button>
                                </Link>
                                <Link to="/Category">
                                <Button sx={{ color: '#4285F4' }} startIcon={<CategoryIcon />}>Categories</Button>
                                </Link>
                                <Link to="/Goal">
                                <Button sx={{ color: '#4285F4' }} startIcon={<FormatListNumberedIcon />}>Goals</Button>
                                </Link>
                                <Link to="/User">
                                <Button sx={{ color: '#4285F4' }} startIcon={<PeopleIcon />}>Users</Button>
                                </Link>
                            </>
                            :
                            <>
                                <Link to="/NutritionPlans">
                                <Button sx={{ color: '#4285F4' }} startIcon={<ListAltIcon />}>Nutrition plans</Button>
                                </Link>
                                <Link to="/ShoppingLists">
                                <Button sx={{ color: '#4285F4' }} startIcon={<ChecklistIcon />}>Shopping lists </Button>
                                </Link>
                                <Link to="/AllergenSelection">
                                <Button sx={{ color: '#4285F4' }} startIcon={<NoMealsIcon />}>My allergens</Button>
                                </Link>
                                <Link to="/CategorySelection">
                                <Button sx={{ color: '#4285F4' }} startIcon={<CategoryIcon />}>My categories</Button>
                                </Link>
                                <Link to="/Product">
                                <Button sx={{ color: '#4285F4' }} startIcon={<KitchenIcon />}>My kitchen</Button>
                                </Link>
                                <Link to="/Recipe">
                                <Button sx={{ color: '#4285F4' }} startIcon={<MenuBookIcon />}>Recipes</Button>
                                </Link>
                                <Link to="/CustomRecipes">
                                <Button sx={{ color: '#4285F4' }} startIcon={<MenuBookIcon />}>Custom recipes</Button>
                                </Link>
                            </>
                        }
                        <div style={{ marginLeft: 'auto' }}>
                            <Link to="/UserProfile">
                            <Button sx={{ color: '#4285F4' }} startIcon={<PersonIcon />}>Profile</Button>
                            </Link>
                            <Button color="error" startIcon={<LogoutIcon />} onClick={Logout}>Logout</Button>
                        </div>
                    </>
                }
                {!isUserLoggedIn() &&
                    <>
                        <Link to="/Register">
                            <Button sx={{ color: 'black' }}>Register</Button>
                        </Link>
                        <Link to="/Login">
                            <Button sx={{ color: 'black' }}>Login</Button>
                        </Link>
                    </>
                }
            </Toolbar>
        </AppBar>
    ) : null;
}
