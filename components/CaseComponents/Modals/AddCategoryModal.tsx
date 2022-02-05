import React, {useState} from "react";
import StyledModal from "./StyledModal";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@material-ui/core";
import {makeStyles, createStyles, Theme} from "@material-ui/core/styles";
import {useMutation, useQuery} from "urql";
import {
    ManagementCategory,
    ManagementContainerQuery,
} from "../CaseManagementContainer";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: "flex",
            flexWrap: "wrap",
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: "25ch",
        },
    })
);

type AddCaseModalProps = {
    open: boolean;
    onClose: () => void;
    onCategoryAdded: () => void;
};

const InsertCategoryMutation = `
mutation AddCategoryMutation($description: String = "", $name: String = "") {
    insert_category_one(object: {description: $description, name: $name}) {
      id
      name
      description
    }
  }  
`;

const AddCategoryModal: React.FC<AddCaseModalProps> = (props) => {
    const classes = useStyles();
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [result, executeMutation] = useMutation(InsertCategoryMutation);

    return (
        <StyledModal open={props.open} onClose={props.onClose}>
            <Typography variant="h4" align="center">
                Add New Category
            </Typography>
            <Box>
                <TextField
                    id="standard-full-width"
                    label="Name"
                    placeholder="Example Category Name"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setName(event.target.value);
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    id="standard-full-width"
                    label="Description"
                    placeholder="Example Category Description"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setDescription(event.target.value);
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Box>
            <Box mt="10px" display="flex" justifyContent="center">
                <Button
                    variant="outlined"
                    onClick={() => {
                        executeMutation({
                            description,
                            name,
                        }).then((res) => {
                            props.onCategoryAdded();
                        });
                        props.onClose();
                    }}
                >
                    Submit
                </Button>
            </Box>
        </StyledModal>
    );
};
export default AddCategoryModal;
