import React, { useState } from 'react';
import { TextField, Button, Grid, Card, CardContent, Typography, Snackbar, CircularProgress, Alert, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/system';

function PincodeFetcher() {
    const [pincode, setPincode] = useState('');
    const [result, setResult] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen size is mobile

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
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100vh' }}>

            {/* Left Split */}
            <div style={{ flex: 1, backgroundColor: '#f0f0f0', padding: '40px', maxWidth: '100%' }}>
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
            <div style={{ flex: 2, backgroundColor: '#ffffff', padding: '40px', overflowY: 'auto', maxWidth: '100%' }}>
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
                        <br />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                            {filteredPostOffices.length > 0 ? (
                                filteredPostOffices.map((location, index) => (
                                    <div
                                        key={index}
                                        style={{ flex: '1 1 calc(50% - 20px)', boxSizing: 'border-box', cursor: 'pointer' }}
                                        onClick={() => window.location.href = `https://www.google.com/maps/search/${location.Name}`}
                                    >
                                        <Card elevation={3} style={{ width: '100%' }}>
                                            <CardContent>
                                                <Typography variant="subtitle1" gutterBottom>
                                                    {location.Name}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>District:</strong> {location.District}
                                                </Typography>
                                                <Typography variant="body2">
                                                    <strong>State:</strong> {location.State}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    Pincode: {location.Pincode}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))
                            ) : (
                                <div style={{ width: '100%' }}>
                                    <Typography variant="h6" align="center" color="textSecondary">
                                        😔 No Name Found With That Letter
                                    </Typography>
                                </div>
                            )}

                        </div>
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
