import React, { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import Tesseract from "tesseract.js";
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  Heading,
  Text,
  Input,
  VStack,
} from "@chakra-ui/react";

const OcrComponent = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => 
      {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const performOCR = async () => {
    if (image) {
      const { data } = await Tesseract.recognize(image, 'eng');
      setText(data.text);
    }
  }

  const generatePDF = async () => {
    if (text) {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();

      page.drawText(text, {
        x: 10,
        y: 800,
        color: rgb(0, 0, 0),
        size: 12,
      });

      const pdfBytes = await pdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'summarized_text.pdf';
      a.click();
    }
  };

  return (
    <VStack p={5} spacing={4}>
      <Heading>OCR APP</Heading>
      <Input type="file" accept="image/*" onChange={handleImageChange} />
      <Button onClick={performOCR}>Perform OCR</Button>
      <Box>
        <Heading size="md">Extracted Text</Heading>
        <Text>{text}</Text>
      </Box>
      <Button onClick={generatePDF} isDisabled={!text}>
        Generate PDF
      </Button>
    </VStack>
  );
}

export default OcrComponent;