from flask import Flask, render_template, request
import pdfplumber
import re
import openai

app = Flask(__name__)

openai.api_key = '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'

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Check if a file was uploaded
        if 'resume' in request.files:
            resume_file = request.files['resume']
            if resume_file.filename.endswith('.pdf'):
                bullet_points = extract_bullet_points(resume_file)
                # Process the extracted bullet points (optional)
                # ...

                # Return the extracted bullet points to the user
                return render_template('results.html', bullet_points=bullet_points)
            else:
                return "Please upload a PDF file."
        else:
            return "No file uploaded."

    return render_template('index.html')


def extract_bullet_points(resume_file):
    bullet_points = []
    work_experience_section = False

    with pdfplumber.open(resume_file) as pdf:
        for page in pdf.pages:
            for line in page.extract_text().split('\n'):
                line = line.strip()
                if recognize_work_experience(line):
                    work_experience_section = True
                elif line.startswith('VOLUNTEER') or line.startswith('SKILLS') or line.startswith('CERTIFICATES'):
                    work_experience_section = False
                elif work_experience_section and (line.startswith('●') or line.startswith('-') or line.startswith("") or line.startswith("•")):
                    bullet_points.append(line.strip())

    return bullet_points


def recognize_work_experience(line):
    # Recognize the work experience section based on common patterns
    # Use regular expressions or other pattern matching techniques
    # Adjust the patterns according to the structure and formatting of the resumes you expect

    # List of patterns to match
    patterns = ['Work Experience', 'Professional Experience', 'Employment History',
                'Experience', 'Career History', 'Job History']

    # Check if any pattern matches the line
    return any(re.search(pattern, line, re.IGNORECASE) for pattern in patterns)


if __name__ == '__main__':
    app.run(debug=True)
