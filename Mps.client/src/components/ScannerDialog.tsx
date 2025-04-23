import { Dialog, DialogTitle, DialogContent, DialogActions, Button, InputLabel } from "@mui/material";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import { DropzoneRootProps } from "react-dropzone";
interface ScannerDialogProps {
    open: boolean;
    onClose: () => void;
    product: { idProductNavigation: { image: string | null } };
    thumbs: string | JSX.Element[];
    files: File[];
    getRootProps: (props?: DropzoneRootProps | undefined) => DropzoneRootProps | undefined;
    getInputProps: (props?: DropzoneRootProps | undefined) => DropzoneRootProps | undefined;
    handleReceiptUpload: () => void;
}

const ScannerDialog: React.FC<ScannerDialogProps> = ({
    open,
    onClose,
    product,
    thumbs,
    files,
    getRootProps,
    getInputProps,
    handleReceiptUpload
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Scan receipt</DialogTitle>
            <DialogContent>
                <InputLabel id="image-label">Receipt's image</InputLabel>
                <section className="container">
                    <div {...getRootProps({ className: 'dropzone dropzone-border' })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                    <aside>
                        {thumbs}
                        {files.length === 0 && product.idProductNavigation.image !== "" ? (
                            <img
                                className="thumbnail"
                                src={
                                    product.idProductNavigation.image === null || product.idProductNavigation.image === ""
                                        ? '/product.svg'
                                        : '/Uploads/' + product.idProductNavigation.image
                                }
                            />
                        ) : (
                            <></>
                        )}
                    </aside>
                </section>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={files.length <= 0}
                    endIcon={<DocumentScannerIcon />}
                    fullWidth
                    variant="contained"
                    onClick={handleReceiptUpload}
                    autoFocus
                >
                    Scan
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ScannerDialog;