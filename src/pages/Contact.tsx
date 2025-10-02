import { memo } from "react";
import { Card, CardContent, Box, Avatar, Typography, Paper } from "@mui/material";
import { LocationOn as LocationIcon } from "@mui/icons-material";
import { users, serviceInfo } from "../data/sampleData";
import PageLayout from "../components/PageLayout";

const Contact = memo(() => {
  // Encode address for Google Maps embed
  const encodedAddress = encodeURIComponent(serviceInfo.contact.address);
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedAddress}`;

  // Alternative: Use query parameter (works without API key but has limitations)
  const mapSrcQuery = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <PageLayout>
      <Box
        sx={{
          mt: 3,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Team Members Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Team Members
            </Typography>
            {users.map((user) => (
              <Box key={user.id} sx={{ py: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="subtitle1">{user.name}</Typography>
                  <Avatar sx={{ width: 32, height: 32 }}>{user.name[0]}</Avatar>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {user.role} · {user.email}
                </Typography>
                {user.phone && (
                  <Typography variant="body2" color="text.secondary">
                    {user.phone}
                  </Typography>
                )}
              </Box>
            ))}
          </CardContent>
        </Card>

        {/* Service Information Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Service Information
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              {serviceInfo.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {serviceInfo.tagline}
            </Typography>
            <Typography variant="body1" paragraph>
              {serviceInfo.description}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Contact Information
            </Typography>
            <Typography variant="body2" gutterBottom>
              Email: {serviceInfo.contact.email}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Phone: {serviceInfo.contact.phone}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Address: {serviceInfo.contact.address}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Google Maps Section */}
      <Paper sx={{ mt: 3, p: 3 }}>
        <Box className="flex-row" sx={{ mb: 2 }}>
          <LocationIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Location</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {serviceInfo.contact.address}
        </Typography>
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 450,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 0,
            overflow: 'hidden'
          }}
        >
          <iframe
            src={mapSrcQuery}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location Map"
          />
        </Box>
      </Paper>
    </PageLayout>
  );
});

export default Contact;
