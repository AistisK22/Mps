import { Recipe } from "../models/recipeModels";

function SelectedRecipeCard({ recipe, handleRecipeDelete }: { recipe: Recipe, handleRecipeDelete: (id: number) => void }) {
    return (
        <div key={recipe.spoonacularId} style={{ position: 'relative' }}>
            <h3 style={{ textAlign: "center" }}>{recipe.title}</h3>
            <div style={{ position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                <img className="recipeCard" style={{ width: '100%', height: 'auto', borderRadius: '4px' }} src={recipe.imageUrl} alt={recipe.title} />
                <button
                    onClick={() => handleRecipeDelete(recipe.recipeId)}
                    style={{
                        position: 'absolute',
                        top: '5%',
                        left: '5%',
                        transform: 'translate(-5%, -5%)',
                        backgroundColor: 'red'
                    }}
                >
                    -
                </button>
            </div>
        </div>
    );
}

export default SelectedRecipeCard;