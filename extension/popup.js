pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

document.getElementById('tweakBtn').addEventListener('click', async () => {
  const resumeFile = document.getElementById('resumeFile').files[0];
  const jobDesc = document.getElementById('jobDesc').value;

  if (!resumeFile || !jobDesc) {
    alert('Please upload a resume and enter a job description.');
    return;
  }

  try {
    console.log('Reading file...');
    const resumeText = await readFile(resumeFile);
    console.log('Resume text:', resumeText);

    console.log('Sending fetch to Render...');
    const response = await fetch('https://resume-tweaker.onrender.com/tweak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resume: resumeText, jobDesc })
    });
    console.log('Fetch response:', response);

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Response data:', data);

    if (data.message === 'Tweaked') {
      const tweakedResume = data.tweakedResume;
      document.getElementById('downloadPDF').onclick = () => downloadPDF(tweakedResume);
      document.getElementById('downloadWord').onclick = () => downloadWord(tweakedResume);
    } else {
      alert('Error tweaking resume: ' + JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error in tweak process:', error);
    alert('Error: ' + error.message);
  }
});

async function readFile(file) {
  try {
    if (file.type === 'application/pdf') {
      const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
      }
      return text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } else {
      return await file.text();
    }
  } catch (error) {
    throw new Error('File reading failed: ' + error.message);
  }
}

function downloadPDF(text) {
  try {
    const { jsPDF } = window.jspdf;  // UMD format
    const doc = new jsPDF();
    doc.text(text, 10, 10);
    doc.save('tweaked_resume.pdf');
  } catch (error) {
    console.error('PDF download error:', error);
    alert('PDF download failed: ' + error.message);
  }
}

function downloadWord(text) {
  try {
    const doc = new docx.Document({ sections: [{ properties: {}, children: [new docx.Paragraph(text)] }] });
    docx.Packer.toBlob(doc).then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tweaked_resume.docx';
      a.click();
      URL.revokeObjectURL(url);
    });
  } catch (error) {
    console.error('Word download error:', error);
    alert('Word download failed: ' + error.message);
  }
}