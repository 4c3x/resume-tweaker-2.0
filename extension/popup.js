pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdf.worker.js';

let tweakedResume = '';

document.getElementById('downloadPdf').onclick = function() {
  if (!tweakedResume) {
    alert('No tweaked resume yet!');
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(tweakedResume, 10, 10);
  doc.save('tweaked_resume.pdf');
};

document.getElementById('downloadWord').onclick = function() {
  if (!tweakedResume) {
    alert('No tweaked resume yet!');
    return;
  }
  const { Document, Packer, Paragraph } = window.docx;
  const doc = new Document({
    sections: [{
      children: [new Paragraph(tweakedResume)]
    }]
  });
  Packer.toBlob(doc).then(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tweaked_resume.docx';
    a.click();
    URL.revokeObjectURL(url);
  });
};

document.getElementById('tweakBtn').addEventListener('click', async () => {
  const resume = document.getElementById('resume').files[0];
  const jobDesc = document.getElementById('jobDesc').value;

  if (!resume || !jobDesc) {
    alert('Please upload a resume and enter a job description!');
    return;
  }

  let resumeText = '';
  try {
    if (resume.name.endsWith('.pdf')) {
      const arrayBuffer = await resume.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      const page = await pdf.getPage(1);
      const textContent = await page.getTextContent();
      resumeText = textContent.items.map(item => item.str).join(' ');
    } else if (resume.name.endsWith('.docx')) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const { value } = await mammoth.extractRawText({ arrayBuffer: e.target.result });
        resumeText = value;
        sendToServer(resumeText, jobDesc);
      };
      reader.readAsArrayBuffer(resume);
      return;
    } else {
      alert('Please upload a PDF or Word (.docx) file!');
      return;
    }
    sendToServer(resumeText, jobDesc);
  } catch (error) {
    console.error('Error parsing resume:', error);
    alert('Failed to parse resume. Check console for details.');
  }
});

function sendToServer(resumeText, jobDesc) {
  fetch('http://localhost:3000/tweak', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resume: resumeText, jobDesc })
  })
    .then(res => res.json())
    .then(data => {
      console.log('Server response:', data);
      if (data.tweakedResume) {
        tweakedResume = data.tweakedResume;
        document.getElementById('tweakedOutput').textContent = tweakedResume;
        // Clear inputs
        document.getElementById('resume').value = '';
        document.getElementById('jobDesc').value = '';
        alert('Resume tweaked! Click the buttons to download.');
      } else {
        alert('Tweaking failed. Check console.');
      }
    })
    .catch(error => {
      console.error('Server error:', error);
      alert('Server error. Check console.');
    });
}