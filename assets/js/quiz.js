class DevOpsQuiz {
    constructor() {
        this.currentLevel = '';
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.selectedAnswer = null;
        this.score = 0;
        this.answers = [];
        this.categoryScores = {};
        
        this.initializeEventListeners();
        this.loadQuestions();
    }

    initializeEventListeners() {
        // Level selection
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectLevel(e.currentTarget.dataset.level);
            });
        });

        // Submit answer
        document.getElementById('submitAnswer').addEventListener('click', () => {
            this.submitAnswer();
        });

        // Next question
        document.getElementById('nextQuestion').addEventListener('click', () => {
            this.nextQuestion();
        });

        // Restart quiz
        document.getElementById('restartQuiz').addEventListener('click', () => {
            this.restartQuiz();
        });
    }

    async loadQuestions() {
        try {
            // Try both production and development paths
            let response;
            try {
                response = await fetch('/devops_quiz/assets/data/questions.json');
            } catch (e) {
                response = await fetch('/assets/data/questions.json');
            }
            this.allQuestions = await response.json();
        } catch (error) {
            console.error('Error loading questions:', error);
            // Fallback to embedded questions if file loading fails
            this.allQuestions = this.getEmbeddedQuestions();
        }
    }

    selectLevel(level) {
        this.currentLevel = level;
        this.currentQuestions = this.getRandomQuestions(level, 10);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];
        this.categoryScores = {};
        
        // Hide level selection, show quiz
        document.getElementById('levelSelection').style.display = 'none';
        document.getElementById('quizSection').style.display = 'block';
        
        // Update title
        document.getElementById('quizTitle').textContent = `${level.charAt(0).toUpperCase() + level.slice(1)} Level Quiz`;
        
        this.displayQuestion();
    }

    getRandomQuestions(level, count) {
        const levelQuestions = this.allQuestions[level] || [];
        const shuffled = [...levelQuestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    displayQuestion() {
        const question = this.currentQuestions[this.currentQuestionIndex];
        if (!question) return;

        // Update progress
        document.getElementById('questionCounter').textContent = `Question ${this.currentQuestionIndex + 1} of ${this.currentQuestions.length}`;
        document.getElementById('progressFill').style.width = `${((this.currentQuestionIndex + 1) / this.currentQuestions.length) * 100}%`;

        // Display question
        document.getElementById('questionCategory').textContent = question.category;
        document.getElementById('questionText').textContent = question.question;

        // Display options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.dataset.option = index;
            
            optionElement.innerHTML = `
                <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                <div class="option-text">${option}</div>
            `;
            
            optionElement.addEventListener('click', () => {
                this.selectOption(index);
            });
            
            optionsContainer.appendChild(optionElement);
        });

        // Reset UI state
        this.selectedAnswer = null;
        document.getElementById('submitAnswer').disabled = true;
        document.getElementById('answerFeedback').style.display = 'none';
    }

    selectOption(index) {
        // Remove previous selection
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selection to clicked option
        document.querySelector(`[data-option="${index}"]`).classList.add('selected');
        
        this.selectedAnswer = index;
        document.getElementById('submitAnswer').disabled = false;
    }

    submitAnswer() {
        if (this.selectedAnswer === null) return;

        const question = this.currentQuestions[this.currentQuestionIndex];
        const isCorrect = this.selectedAnswer === question.correct;
        
        if (isCorrect) {
            this.score++;
        }

        // Track category scores
        if (!this.categoryScores[question.category]) {
            this.categoryScores[question.category] = { correct: 0, total: 0 };
        }
        this.categoryScores[question.category].total++;
        if (isCorrect) {
            this.categoryScores[question.category].correct++;
        }

        this.answers.push({
            question: question.question,
            selectedAnswer: this.selectedAnswer,
            correctAnswer: question.correct,
            isCorrect: isCorrect,
            category: question.category
        });

        this.showFeedback(isCorrect, question);
    }

    showFeedback(isCorrect, question) {
        const feedbackHeader = document.getElementById('feedbackHeader');
        const feedbackExplanation = document.getElementById('feedbackExplanation');
        const feedbackLink = document.getElementById('feedbackLink');

        feedbackHeader.textContent = isCorrect ? '✅ Correct!' : '❌ Incorrect';
        feedbackHeader.className = isCorrect ? 'feedback-header correct' : 'feedback-header incorrect';
        
        feedbackExplanation.textContent = question.explanation;
        
        if (question.link) {
            feedbackLink.innerHTML = `<a href="${question.link}" target="_blank">📚 Learn more about this topic</a>`;
        } else {
            feedbackLink.innerHTML = '';
        }

        document.getElementById('answerFeedback').style.display = 'block';
        document.getElementById('submitAnswer').style.display = 'none';
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.showResults();
        } else {
            document.getElementById('submitAnswer').style.display = 'block';
            this.displayQuestion();
        }
    }

    showResults() {
        const percentage = Math.round((this.score / this.currentQuestions.length) * 100);
        
        document.querySelector('.question-container').style.display = 'none';
        document.getElementById('answerFeedback').style.display = 'none';
        document.getElementById('quizResults').style.display = 'block';

        document.getElementById('scoreDisplay').textContent = `${this.score}/${this.currentQuestions.length} (${percentage}%)`;

        // Show breakdown by category
        const breakdown = document.getElementById('resultsBreakdown');
        breakdown.innerHTML = '<h3>Results by Category:</h3>';
        
        Object.entries(this.categoryScores).forEach(([category, scores]) => {
            const categoryPercentage = Math.round((scores.correct / scores.total) * 100);
            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-score';
            categoryElement.innerHTML = `
                <span>${category.toUpperCase()}</span>
                <span>${scores.correct}/${scores.total} (${categoryPercentage}%)</span>
            `;
            breakdown.appendChild(categoryElement);
        });
    }

    restartQuiz() {
        document.getElementById('quizResults').style.display = 'none';
        document.getElementById('quizSection').style.display = 'none';
        document.getElementById('levelSelection').style.display = 'block';
        document.querySelector('.question-container').style.display = 'block';
    }

    getEmbeddedQuestions() {
        return {
            junior: [
                {
                    category: 'git',
                    question: 'What command is used to initialize a new Git repository?',
                    options: ['git start', 'git init', 'git create', 'git new'],
                    correct: 1,
                    explanation: 'git init creates a new Git repository in the current directory, setting up the .git folder and initial repository structure.',
                    link: 'https://git-scm.com/docs/git-init'
                },
                {
                    category: 'docker',
                    question: 'What file is used to define a Docker container configuration?',
                    options: ['docker.yml', 'Dockerfile', 'container.conf', 'docker.json'],
                    correct: 1,
                    explanation: 'A Dockerfile contains instructions for building a Docker image, including the base image, dependencies, and commands to run.',
                    link: 'https://docs.docker.com/engine/reference/builder/'
                },
                {
                    category: 'linux',
                    question: 'Which command shows the current working directory?',
                    options: ['pwd', 'cd', 'ls', 'dir'],
                    correct: 0,
                    explanation: 'pwd (print working directory) displays the full path of the current directory you are in.',
                    link: 'https://linux.die.net/man/1/pwd'
                },
                {
                    category: 'aws',
                    question: 'What does EC2 stand for in AWS?',
                    options: ['Elastic Cloud Computing', 'Elastic Compute Cloud', 'Enhanced Cloud Computing', 'Elastic Container Cloud'],
                    correct: 1,
                    explanation: 'EC2 (Elastic Compute Cloud) is AWS service that provides resizable compute capacity in the cloud.',
                    link: 'https://aws.amazon.com/ec2/'
                },
                {
                    category: 'devops-principles',
                    question: 'What is the main goal of DevOps?',
                    options: ['Faster development', 'Better collaboration between Dev and Ops', 'Cost reduction', 'More testing'],
                    correct: 1,
                    explanation: 'DevOps aims to bridge the gap between development and operations teams, fostering collaboration and shared responsibility.',
                    link: 'https://aws.amazon.com/devops/what-is-devops/'
                }
                // Add more junior questions here...
            ],
            competent: [
                {
                    category: 'kubernetes',
                    question: 'What is a Kubernetes Pod?',
                    options: ['A container registry', 'The smallest deployable unit', 'A network policy', 'A storage volume'],
                    correct: 1,
                    explanation: 'A Pod is the smallest deployable unit in Kubernetes and represents one or more containers that share storage and network.',
                    link: 'https://kubernetes.io/docs/concepts/workloads/pods/'
                },
                {
                    category: 'monitoring',
                    question: 'What are the four golden signals of monitoring?',
                    options: ['CPU, Memory, Disk, Network', 'Latency, Traffic, Errors, Saturation', 'Logs, Metrics, Traces, Events', 'Availability, Performance, Security, Cost'],
                    correct: 1,
                    explanation: 'The four golden signals (from Google SRE) are Latency, Traffic, Errors, and Saturation - key metrics for monitoring system health.',
                    link: 'https://sre.google/sre-book/monitoring-distributed-systems/'
                },
                {
                    category: 'azure',
                    question: 'What is Azure Resource Manager (ARM)?',
                    options: ['A VM management tool', 'Infrastructure as Code service', 'A monitoring service', 'A backup solution'],
                    correct: 1,
                    explanation: 'ARM is the deployment and management service for Azure that enables Infrastructure as Code through templates.',
                    link: 'https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview'
                },
                {
                    category: 'gitlab',
                    question: 'What is GitLab CI/CD?',
                    options: ['Version control system', 'Issue tracking tool', 'Continuous Integration/Deployment platform', 'Code review tool'],
                    correct: 2,
                    explanation: 'GitLab CI/CD is an integrated platform for automating software build, test, and deployment processes.',
                    link: 'https://docs.gitlab.com/ee/ci/'
                },
                {
                    category: 'python',
                    question: 'What is a virtual environment in Python?',
                    options: ['A cloud platform', 'An isolated Python installation', 'A testing framework', 'A debugging tool'],
                    correct: 1,
                    explanation: 'A virtual environment creates an isolated Python installation to manage dependencies separately for different projects.',
                    link: 'https://docs.python.org/3/tutorial/venv.html'
                }
                // Add more competent questions here...
            ],
            senior: [
                {
                    category: 'network',
                    question: 'In a microservices architecture, what is the circuit breaker pattern?',
                    options: ['Load balancing technique', 'Fault tolerance mechanism', 'Security protocol', 'Data consistency pattern'],
                    correct: 1,
                    explanation: 'Circuit breaker prevents cascading failures by monitoring service calls and failing fast when a service is unavailable.',
                    link: 'https://martinfowler.com/bliki/CircuitBreaker.html'
                },
                {
                    category: 'gcp',
                    question: 'What is the difference between GKE Autopilot and Standard mode?',
                    options: ['Autopilot is cheaper', 'Autopilot provides full node control', 'Autopilot is fully managed with pre-configured best practices', 'No difference'],
                    correct: 2,
                    explanation: 'GKE Autopilot is a fully managed Kubernetes service that handles node management, security, and scaling automatically.',
                    link: 'https://cloud.google.com/kubernetes-engine/docs/concepts/autopilot-overview'
                },
                {
                    category: 'debug',
                    question: 'What is distributed tracing in microservices?',
                    options: ['Error logging', 'Performance monitoring', 'Request tracking across services', 'Load testing'],
                    correct: 2,
                    explanation: 'Distributed tracing tracks requests as they flow through multiple microservices, helping debug complex distributed systems.',
                    link: 'https://opentracing.io/docs/overview/what-is-tracing/'
                },
                {
                    category: 'github',
                    question: 'What is GitHub Actions matrix strategy?',
                    options: ['Security scanning', 'Parallel job execution with different configurations', 'Branch protection', 'Code review automation'],
                    correct: 1,
                    explanation: 'Matrix strategy allows running jobs in parallel with different combinations of variables like OS, language versions, etc.',
                    link: 'https://docs.github.com/en/actions/using-jobs/using-a-matrix-for-your-jobs'
                },
                {
                    category: 'devops-principles',
                    question: 'What is the principle of "Shift Left" in DevOps?',
                    options: ['Moving servers to the left rack', 'Testing and security earlier in development', 'Reducing team size', 'Focusing on frontend development'],
                    correct: 1,
                    explanation: 'Shift Left means moving testing, security, and quality checks earlier in the development lifecycle to catch issues sooner.',
                    link: 'https://devops.com/shift-left-approach-software-testing/'
                }
                // Add more senior questions here...
            ]
        };
    }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DevOpsQuiz();
});
