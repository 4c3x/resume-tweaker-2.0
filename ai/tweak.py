import sys
import json

def tweak_resume(resume, job_desc):
    # Split job description into words, make a set of keywords
    job_words = set(job_desc.lower().split())
    resume_lines = resume.split('\n')
    tweaked = []

    # Simple MVP: Uppercase lines with matching keywords
    for line in resume_lines:
        if any(word in line.lower() for word in job_words):
            tweaked.append(line.upper())  # Highlight matches
        else:
            tweaked.append(line)
    return '\n'.join(tweaked)

if __name__ == '__main__':
    # Expect input as JSON string from Node.js
    data = json.loads(sys.argv[1])
    result = tweak_resume(data['resume'], data['jobDesc'])
    print(result)