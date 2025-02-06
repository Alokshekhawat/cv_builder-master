import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    TableCell,
    TableRow,
    Table,
    TableBody,
    TableHead,
    Backdrop,
    CircularProgress,
    Container,
    Typography,
    TableContainer,
    Paper
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import ClearIcon from '@mui/icons-material/Clear';
import {JsonEditor as Editor} from 'jsoneditor-react';
import 'jsoneditor-react/es/editor.min.css';


function App() {

    const api_url = "http://127.0.0.1:8000/"; // api url

    // default json to create a new cv
    const defaultJSON = {
        name: "",
        json: {
            header: {
                name: "",
                description: "",
                picture: ""
            },
            left_sections: [],
            right_sections: [],
            contact_info: {
                title: "",
                address: "",
                phone: "",
                email: "",
                links: [],
                other: ""
            }
        }
    }

    const [cv_list, setCvList] = useState([]);              // list of cvs fetched from the database
    const [hidden_edit, _setHiddenEdit] = useState(true);   // state to hide the json editor
    const [hidden_add, _setHiddenAdd] = useState(true);     // state to hide the json editor
    const [cv_json, setCvJson] = useState(defaultJSON);                 // state to hold the json of a cv
    const [loading, setLoading] = React.useState(false);    // state to show the loading indicator


    // useEffect is called when the component is mounted, to automatically get the CV list.
    useEffect(() => {
        get_cv_list();
    }, []);

    // The two following functions are to prevent from having two json editors at the same time.
    const setHiddenEdit = (value) => {
        if (value === false) {
            _setHiddenEdit(false);
            _setHiddenAdd(true);
        } else {
            _setHiddenEdit(true);
        }
    };

    const setHiddenAdd = (value) => {
        if (value === false) {
            _setHiddenEdit(true);
            _setHiddenAdd(false);
        } else {
            _setHiddenAdd(true);
        }
    };

    // This function fetches the cv list from the backend, and sets the cv list state
    const get_cv_list = () => {
        fetch(api_url + "list_cvs/", {
            method: "GET", headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setCvList(data);
            })
    }

    const create_cv = () => {
        fetch(api_url + "create_cv/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(cv_json)
        })
            .then(() => {
                get_cv_list();
            })
    }

    // This function removes a CV from the database with its ID
    const remove_cv = (id) => {
        fetch(api_url + "delete_cv/", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                id: id
            })
        })
            .then(() => {
                get_cv_list();
            })
    }

    // This function updates a CV in the database using its ID
    const update_cv = (id, cv) => {
        fetch(api_url + "update_cv/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                id: id, name: cv['name'], json: cv['json']
            })
        })
            .then(() => {
                get_cv_list();
            })
    }

    // This function gets from the API the url of the PDF of a CV
    const get_cv_path = async (id) => {
        setLoading(true);
        const res = await fetch(api_url + "create_pdf/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                id: id
            })
        })
        const data = await res.text() // We have to wait for the response to get to the url
        await window.open(api_url + data.slice(1), '_blank');
        setLoading(false);
    }

    // This function opens the editor to edit a CV JSON
    const edit_cv = (id) => {
        setHiddenEdit(true)
        // Finding the desired CV in the list
        for (let i = 0; i < cv_list.length; i++) {
            if (cv_list[i].id === id) {
                setCvJson(cv_list[i]);
            }
        }
        // This opening-closing is simply to change the JSON inside the editor
        setTimeout(function () {
            setHiddenEdit(false)
        }, 1);
    }


    return (
        <Container>
            {/*This is the loading indicator to display when the CV is being converted into a PDF*/}
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Typography variant={'h3'} align={'center'}>CV Builder</Typography>
            <Typography
                sx={{m: '1rem', fontStyle: 'italic'}}
                align={"center"}
                variant={"h5"}>
                The CV Builder is a tool to help you create your CV in a simple and easy way.
            </Typography>
            <Box
                display={'flex'}
                justifyContent={'flex-end'}
            >
                {/*When clicking on the Add button, we set the default CV and display the editor*/}
                <Button
                    variant={'contained'}
                    color={'info'}
                    style={{marginBottom: '1rem'}}
                    onClick={() => {
                        setCvJson(defaultJSON);
                        setHiddenAdd(false);
                    }}
                >
                    Add a new CV
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                style={{fontWeight: 'bold', fontSize: '1rem'}}
                            >Id</TableCell>
                            <TableCell
                                style={{fontWeight: 'bold', fontSize: '1rem'}}
                            >Name</TableCell>
                            <TableCell
                                style={{fontWeight: 'bold', fontSize: '1rem'}}
                                align={'center'}
                                colspan={3}
                            >Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {// If there are no CVs in the database, we display a message in the table
                            cv_list.length === 0 ?
                                <TableCell colspan={3} align={"center"}>
                                    <Typography variant={'h5'} align={'center'}>
                                        No CVs found.
                                    </Typography>
                                </TableCell>
                                :
                                // Cycling through the list of CVs and displaying them in the table
                                cv_list.map(cv => (<TableRow key={cv.id}>
                                    <TableCell>{cv.id}</TableCell>
                                    <TableCell>{cv.name}</TableCell>
                                    <TableCell align={'center'}>
                                        <Button
                                            startIcon={<EditIcon/>}
                                            onClick={() => {
                                                edit_cv(cv.id);
                                            }}>
                                            Edit</Button>
                                    </TableCell>
                                    <TableCell align={'center'}>
                                        <Button
                                            startIcon={<DeleteIcon/>}
                                            onClick={() => remove_cv(cv.id)}>
                                            Remove</Button>
                                    </TableCell>
                                    <TableCell align={'center'}>
                                        <Button
                                            startIcon={<DownloadIcon/>}
                                            onClick={() => get_cv_path(cv.id)}>
                                            Download</Button>
                                    </TableCell>
                                </TableRow>))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            {// The json editor that displays to add a new CV
                !hidden_add ?
                <Box sx={{mt: '3rem'}}>
                    <Typography
                        sx={{m: '1rem'}}
                        align={"center"}
                        variant={"h5"}>
                        Add a new CV
                    </Typography>
                    <Editor
                        value={cv_json}
                        onChange={setCvJson}
                        history
                        mode={Editor.modes.code}
                        navigationBar={false}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            marginTop: '2rem'
                        }}
                    >
                        {/*When we want to save a new CV, and add it to the database,
                        we send the created json with the create_cv function, and hide the json editor*/}
                        <Button
                            variant={"contained"}
                            startIcon={<SaveIcon/>}
                            onClick={() => {
                                create_cv(cv_json);
                                setHiddenAdd(true)
                            }}
                            color={"success"}
                            style={{width: '40%'}}>
                            Save
                        </Button>
                        {/*simple button to clear the json, and hide the editor*/}
                        <Button
                            variant={"contained"}
                            startIcon={<ClearIcon/>}
                            onClick={() => {
                                setHiddenAdd(true)
                                setCvJson(defaultJSON)
                            }}
                            color={"error"}
                            style={{width: '40%'}}>
                            Cancel
                        </Button>
                    </Box>
                </Box> : null}
            {/*More or less same part as the previous one, but with editing, so we are sending
            an edit request to the API.*/}
            {!hidden_edit ?
                <Box sx={{mt: '3rem'}}>
                    <Typography
                        sx={{m: '1rem'}}
                        align={"center"}
                        variant={"h5"}>
                        Edit CV {cv_json['name']}
                    </Typography>
                    <Editor
                        value={cv_json}
                        onChange={setCvJson}
                        history
                        mode={Editor.modes.tree}
                        navigationBar={false}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            marginTop: '2rem'
                        }}
                    >
                        <Button
                            variant={"contained"}
                            startIcon={<SaveIcon/>}
                            onClick={() => {
                                update_cv(cv_json['id'], cv_json);
                                setHiddenEdit(true)
                            }}
                            color={"success"}
                            style={{width: '40%'}}>
                            Save
                        </Button>
                        <Button
                            variant={"contained"}
                            startIcon={<ClearIcon/>}
                            onClick={() => {
                                setHiddenEdit(true)
                                setCvJson(defaultJSON)
                            }}
                            color={"error"}
                            style={{width: '40%'}}>
                            Cancel
                        </Button>
                    </Box>
                </Box> : null}
        </Container>);
}

export default App;
