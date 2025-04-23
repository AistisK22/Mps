import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Tooltip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import InfoIcon from '@mui/icons-material/Info';
interface ShoppingListDialogProps {
    open: boolean;
    setOpenShoppingListDialog: (value: boolean) => void;
    handleShoppingListConfirmation: (event: React.FormEvent<HTMLDivElement>) => void;
    setShoppingListTitle: (value: string) => void;
}

const ShoppingListDialog: React.FC<ShoppingListDialogProps> = ({ open, setOpenShoppingListDialog, handleShoppingListConfirmation, setShoppingListTitle }) => {

    return (
        <Dialog component="form" onSubmit={handleShoppingListConfirmation} onClose={() => setOpenShoppingListDialog(false)} open={open}>
            <DialogTitle>Create a shopping list</DialogTitle>
            <DialogContent>
                <div style={{ position: 'relative' }}>
                    <Tooltip title={<a href="https://storyset.com/work">Work illustrations by Storyset</a>} placement="top">
                        <IconButton style={{ position: 'absolute', top: 0, right: 0 }}>
                            <InfoIcon />
                        </IconButton>
                    </Tooltip>
                    <img
                        style={{ maxWidth: "600px", maxHeight: "600px", width: "100%", height: '100%', borderRadius: '4px' }}
                        src="/shoppingList.gif"
                        alt="Eating healthy food"
                    />
                </div>
                <TextField
                    margin="dense"
                    required
                    name="shoppingListTitle"
                    label="Title"
                    fullWidth
                    onChange={(e) => setShoppingListTitle(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button endIcon={<CloseIcon />} onClick={() => setOpenShoppingListDialog(false)}>Cancel</Button>
                <Button endIcon={<AutorenewIcon />} type="submit" sx={{ color: '#FFA500' }}>Generate</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ShoppingListDialog;
