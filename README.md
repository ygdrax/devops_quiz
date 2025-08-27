# DevOps Knowledge Quiz

A comprehensive DevOps quiz application built with Jekyll and hosted on GitHub Pages. Test your knowledge across different experience levels with questions covering various DevOps tools and practices.

## Features

- **Three Experience Levels**: Junior (0-2 years), Competent (2-5 years), Senior (5+ years)
- **10 Questions per Session**: Randomly selected from a pool of 100+ questions per level
- **Multiple Categories**: 
  - Git/GitHub/GitLab
  - Docker & Containerization
  - Kubernetes
  - AWS, Azure, GCP
  - Linux
  - Python
  - Monitoring & Observability
  - Debugging
  - Networking
  - DevOps Principles
- **Interactive UI**: Clean, modern interface with progress tracking
- **Immediate Feedback**: Get explanations and documentation links for each answer
- **Score Tracking**: See your performance by category

## Live Demo

Visit the quiz at: [https://ygdrax.github.io/devops_quiz](https://ygdrax.github.io/devops_quiz)

## Local Development

### Prerequisites

- Ruby 2.7 or higher
- Bundler gem

### Setup

1. Clone the repository:
```bash
git clone https://github.com/ygdrax/devops_quiz.git
cd devops_quiz
```

2. Install dependencies:
```bash
bundle install
```

3. Serve the site locally:
```bash
bundle exec jekyll serve
```

4. Open your browser to `http://localhost:4000/devops_quiz`

## Project Structure

```
devops_quiz/
├── _config.yml              # Jekyll configuration
├── _layouts/
│   └── default.html         # Main layout template
├── assets/
│   ├── css/
│   │   └── style.css        # Styles
│   ├── js/
│   │   └── quiz.js          # Quiz functionality
│   └── data/
│       └── questions.json   # Question database
├── .github/
│   └── workflows/
│       └── jekyll.yml       # GitHub Actions deployment
├── index.html               # Main quiz page
├── Gemfile                  # Ruby dependencies
└── README.md
```

## Adding Questions

Questions are stored in `assets/data/questions.json`. Each question follows this structure:

```json
{
  "category": "docker",
  "question": "What is a Docker image?",
  "options": [
    "A running container",
    "A template for creating containers", 
    "A configuration file",
    "A network setting"
  ],
  "correct": 1,
  "explanation": "A Docker image is a read-only template...",
  "link": "https://docs.docker.com/get-started/overview/#images"
}
```

### Categories

- `git` - Git version control
- `github` - GitHub platform
- `gitlab` - GitLab platform  
- `docker` - Docker containerization
- `kubernetes` - Kubernetes orchestration
- `aws` - Amazon Web Services
- `azure` - Microsoft Azure
- `gcp` - Google Cloud Platform
- `linux` - Linux operating system
- `python` - Python programming
- `monitoring` - Monitoring & observability
- `debug` - Debugging & troubleshooting
- `network` - Networking concepts
- `devops-principles` - DevOps practices

## Deployment

The site automatically deploys to GitHub Pages when you push to the `develop` or `main` branch using GitHub Actions.

### Manual Deployment

1. Enable GitHub Pages in repository settings
2. Set source to "GitHub Actions"
3. Push to your default branch

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Add your questions or improvements
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Guidelines for Contributing Questions

- Ensure questions are accurate and up-to-date
- Provide clear explanations with links to official documentation
- Follow the existing JSON structure
- Categorize questions appropriately
- Test questions for clarity and correctness

## License

This project is open source and available under the [MIT License](LICENSE).

## Learning Resources

- [AWS Documentation](https://docs.aws.amazon.com/)
- [Azure Documentation](https://docs.microsoft.com/en-us/azure/)
- [GCP Documentation](https://cloud.google.com/docs)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [DevOps Institute](https://devopsinstitute.com/)

## Tags

devops, quiz, learning, aws, azure, gcp, kubernetes, docker, github-pages, jekyll, education
