import React, { useState } from 'react';
import { TextField, Button, Grid, Card, CardContent, Typography, Snackbar, CircularProgress, Alert } from '@mui/material';

function PincodeFetcher() {
    const [pincode, setPincode] = useState('');
    const [result, setResult] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleFetch = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();
            setResult(data[0]);
            setSearchTerm('');
            showSnackbar('Data fetched successfully!', 'success');
        } catch (error) {
            console.error('Error fetching data:', error);
            showSnackbar('Failed to fetch data!', 'error');
        }
        setLoading(false);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };


    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const filteredPostOffices = result?.PostOffice?.filter((office) => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
            office.Name.toLowerCase().startsWith(lowerSearchTerm) ||
            office.District.toLowerCase().startsWith(lowerSearchTerm) ||
            office.State.toLowerCase().startsWith(lowerSearchTerm) ||
            office.Country.toLowerCase().startsWith(lowerSearchTerm)
        );
    }) || [];


    return (
        <div style={{ display: 'flex', height: '100vh' }}>

            {/* Left Split */}
            <div style={{ flex: 1, backgroundColor: '#f0f0f0', padding: '40px' }}>
                <Typography variant="h4" gutterBottom>
                    Enter Pincode
                </Typography>
                <TextField
                    label="Pincode"
                    variant="outlined"
                    fullWidth
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                />
                <br /><br />
                <Button variant="contained" color="primary" onClick={handleFetch}>
                    Fetch Data
                </Button>
            </div>

            {/* Right Split */}
            <div style={{ flex: 2, backgroundColor: '#ffffff', padding: '40px', overflowY: 'auto' }}>
                <Typography variant="h4" gutterBottom>
                   Fetched Data
                </Typography>

                {/* Search Bar */}
                {result && (
                    <>
                        <TextField
                            label="Search Post Offices"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            //onKeyUp={handleSearchKeyUp}
                            onChange={handleSearchChange}
                            placeholder="Search by Name of the city"
                            style={{ marginBottom: '20px' }}
                        />

                    </>
                )}

                {/* Loader Animation */}
                {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
                        <CircularProgress />
                    </div>
                )}

                {/* Results Section */}
                {!loading && result ? (
                    <>
                        {/* <Typography variant="h6">Status: {result.Status}</Typography> */}
                        {/* <Typography variant="h6">Message: {result.Message}</Typography> */}
                        <br />
                        <Grid container spacing={3}>
                            {filteredPostOffices.length > 0 ? (
                                filteredPostOffices.map((office, index) => (
                                    <Grid item xs={12} sm={6} md={6} key={index}>
                                        <Card elevation={3}>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    {office.Name}
                                                </Typography>
                                                <Typography variant="body1">
                                                    District: {office.District}
                                                </Typography>
                                                <Typography variant="body1">
                                                    State: {office.State}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Country: {office.Country}
                                                </Typography>
                                                <Typography variant="body2" color="textSecondary">
                                                    Pincode: {office.Pincode}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Typography variant="h6" align="center" color="textSecondary">
                                        😔 No Name Found With That Letter
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </>
                ) : (
                    !loading && <Typography variant="body1">Enter the Pincode Data show Here ...</Typography>
                )}
            </div>

            {/* Snackbar for Toast Messages */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={1000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

        </div>
    );
}

export default PincodeFetcher;
