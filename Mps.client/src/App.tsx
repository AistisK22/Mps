import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipeList from './pages/Recipe/RecipeList';
import RecipeView from './pages/Recipe/RecipeView';
import AllergenList from './pages/Allergen/AllergenList';
import CategoryList from './pages/Category/CategoryList';
import GoalList from './pages/Goal/GoalList';
import Register from './pages/Auth/Register';
import NavBar from './components/NavBar';
import Login from './pages/Auth/Login';
import UserList from './pages/User/UserList';
import UserProfile from './pages/User/UserProfile';
import ProtectedRoute from './pages/Auth/ProtectedRoute';
import NutritionPlanView from './pages/NutritionPlan/NutritionPlanView';
import AllergenSelectionView from './pages/Allergen/AllergenSelectionView';
import CategorySelectionView from './pages/Category/CategorySelectionView';
import NutritionPlanList from './pages/NutritionPlan/NutritionPlanList';
import ProductList from './pages/Product/ProductList';
import ShoppingListView from './pages/ShoppingList/ShoppingListView';
import ShoppingListList from './pages/ShoppingList/ShoppingListList';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ChangePassword from './pages/Auth/ChangePassword';
import CustomRecipeView from './pages/Recipe/CustomRecipe';
import CustomRecipeList from './pages/Recipe/CustomRecipeList';
function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/*" element={<ProtectedRoute />}>
                    <Route path="Allergen" element={<AllergenList />} />
                    <Route path="Product" element={<ProductList />} />
                    <Route path="NutritionPlans" element={<NutritionPlanList />} />
                    <Route path="AllergenSelection" element={<AllergenSelectionView />} />
                    <Route path="CategorySelection" element={<CategorySelectionView />} />
                    <Route path=":id?" element={<NutritionPlanView />} />
                    <Route path="Category" element={<CategoryList />} />
                    <Route path="Goal" element={<GoalList />} />
                    <Route path="User" element={<UserList />} />
                    <Route path="UserProfile" element={<UserProfile />} />
                    <Route path="Recipe" element={<RecipeList />} />
                    <Route path="Recipe/:id" element={<RecipeView />} />
                    <Route path="ShoppingList/:id" element={<ShoppingListView />} />
                    <Route path="ShoppingLists" element={<ShoppingListList />} />
                    <Route path="CustomRecipes" element={<CustomRecipeList />} />
                    <Route path="CustomRecipe/:id?" element={<CustomRecipeView />} />
                </Route>
                <Route path="/Register" element={<Register />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                <Route path="/ChangePassword/:id" element={<ChangePassword />} />
            </Routes>
        </Router>
    );
}

export default App;
