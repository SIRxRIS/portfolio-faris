// src/components/Certificate.jsx

import React, { useState } from "react";
import { Modal, IconButton, Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";

const Certificate = ({ certificate }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const openPdfInNewTab = () => {
    window.open(certificate.img, "_blank");
  };

  // Fungsi untuk download PDF
  const downloadPdf = () => {
    const link = document.createElement("a");
    link.href = certificate.img;
    link.download = `${certificate.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box component="div" sx={{ width: "100%" }}>
      {/* Certificate Card */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background:
            "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 24px rgba(139, 92, 246, 0.3)",
            "& .overlay": {
              opacity: 1,
            },
            "& .hover-content": {
              transform: "translate(-50%, -50%)",
              opacity: 1,
            },
          },
        }}
        onClick={handleOpen}
      >
        {/* Certificate Content */}
        <Box
          sx={{
            padding: 3,
            textAlign: "center",
            minHeight: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* PDF Icon */}
          <PictureAsPdfIcon
            sx={{
              fontSize: 48,
              color: "#f87171",
              mb: 2,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          />

          {/* Certificate Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#ffffff",
              mb: 1,
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {certificate.title}
          </Typography>

          {/* Issuer */}
          <Typography
            variant="body2"
            sx={{
              color: "#a78bfa",
              mb: 1,
              fontWeight: 500,
            }}
          >
            {certificate.issuer}
          </Typography>

          {/* Year and Category */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                backgroundColor: "rgba(139, 92, 246, 0.2)",
                color: "#c4b5fd",
                padding: "2px 8px",
                borderRadius: 1,
                fontSize: "0.75rem",
              }}
            >
              {certificate.year}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                color: "#93c5fd",
                padding: "2px 8px",
                borderRadius: 1,
                fontSize: "0.75rem",
              }}
            >
              {certificate.category}
            </Typography>
          </Box>
        </Box>

        {/* Hover Overlay */}
        <Box
          className="overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            opacity: 0,
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          {/* Hover Content */}
          <Box
            className="hover-content"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -60%)",
              opacity: 0,
              transition: "all 0.4s ease",
              textAlign: "center",
              color: "white",
            }}
          >
            <FullscreenIcon
              sx={{
                fontSize: 40,
                mb: 1,
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Lihat Sertifikat
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="certificate-modal-title"
        aria-describedby="certificate-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "90%",
            maxWidth: "600px",
            maxHeight: "90vh",
            backgroundColor: "#1a1a2e",
            borderRadius: 2,
            outline: "none",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            overflow: "hidden",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.6)",
              zIndex: 10,
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.8)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Modal Content */}
          <Box sx={{ padding: 3, textAlign: "center" }}>
            {/* Certificate Info */}
            <PictureAsPdfIcon
              sx={{
                fontSize: 64,
                color: "#f87171",
                mb: 2,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#ffffff",
                mb: 1,
              }}
            >
              {certificate.title}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#a78bfa",
                mb: 2,
                fontWeight: 500,
              }}
            >
              {certificate.issuer}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#94a3b8",
                mb: 3,
                lineHeight: 1.6,
              }}
            >
              {certificate.description}
            </Typography>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={downloadPdf}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 flex items-center gap-2"
              >
                <DownloadIcon sx={{ fontSize: 20 }} />
                Download PDF
              </button>
              <button
                onClick={openPdfInNewTab}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center gap-2"
              >
                <FullscreenIcon sx={{ fontSize: 20 }} />
                Lihat Fullscreen
              </button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Certificate;
