class ExamApp {
    constructor() {
        this.currentExamType = null;
        this.currentPackageId = null;
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = {}; // key: question index, value: selected option index
        this.doubtfulAnswers = new Set(); // tracks question indices marked as doubtful
        
        this.timerInterval = null;
        this.timeRemaining = 0; // in seconds

        this.initElements();
    }

    initElements() {
        // Screens
        this.homeScreen = document.getElementById('home-screen');
        this.packageScreen = document.getElementById('package-screen');
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultScreen = document.getElementById('result-screen');
        
        // Package UI
        this.packageTitle = document.getElementById('package-title');
        this.packageList = document.getElementById('package-list');

        // Quiz UI
        this.examTitle = document.getElementById('exam-title');
        this.progressFill = document.getElementById('progress-fill');
        this.currentQNum = document.getElementById('current-q-num');
        this.totalQNum = document.getElementById('total-q-num');
        this.questionCategory = document.getElementById('question-category');
        this.questionText = document.getElementById('question-text');
        this.optionsContainer = document.getElementById('options-container');
        this.btnPrev = document.getElementById('btn-prev');
        this.btnNext = document.getElementById('btn-next');
        this.btnFinish = document.getElementById('btn-finish');
        this.navGrid = document.getElementById('nav-grid');
        this.btnDoubt = document.getElementById('btn-doubt');
        this.btnClear = document.getElementById('btn-clear');
        
        // Header
        this.timerContainer = document.getElementById('timer');
        this.timeDisplay = document.getElementById('time-display');
    }

    switchScreen(screenElement) {
        this.homeScreen.classList.remove('active');
        this.packageScreen.classList.remove('active');
        this.quizScreen.classList.remove('active');
        this.resultScreen.classList.remove('active');
        
        screenElement.classList.add('active');
    }

    showPackageSelection(type) {
        this.currentExamType = type;
        const examCategory = examData[type];
        
        if(!examCategory) {
            alert("Data ujian tidak ditemukan!");
            return;
        }

        this.packageTitle.textContent = `Pilih Paket - ${examCategory.title}`;
        this.packageList.innerHTML = '';

        examCategory.packages.forEach((pkg, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary btn-large';
            // Tampilkan jumlah soal asli dari data.js
            btn.innerHTML = `<span class="btn-icon">📁</span> ${pkg.name} (${pkg.questions.length} Soal)`;
            btn.onclick = () => this.startExam(index);
            this.packageList.appendChild(btn);
        });

        this.switchScreen(this.packageScreen);
    }

    startExam(packageIndex) {
        this.currentPackageId = packageIndex;
        const examCategory = examData[this.currentExamType];
        const selectedPackage = examCategory.packages[packageIndex];
        
        this.questions = selectedPackage.questions;
        this.currentQuestionIndex = 0;
        this.userAnswers = {};
        this.doubtfulAnswers = new Set();
        
        this.examTitle.textContent = `${examCategory.title} - ${selectedPackage.name}`;
        this.totalQNum.textContent = this.questions.length;
        
        this.timeRemaining = examCategory.durationMinutes * 60;
        
        this.initNavGrid();
        this.startTimer();
        this.switchScreen(this.quizScreen);
        this.loadQuestion();
    }

    initNavGrid() {
        this.navGrid.innerHTML = '';
        this.questions.forEach((_, index) => {
            const box = document.createElement('div');
            box.className = 'nav-box';
            box.textContent = index + 1;
            box.id = `nav-box-${index}`;
            box.onclick = () => this.jumpToQuestion(index);
            this.navGrid.appendChild(box);
        });
    }

    updateNavGrid() {
        for(let i = 0; i < this.questions.length; i++) {
            const box = document.getElementById(`nav-box-${i}`);
            if(!box) continue;
            
            // Remove active/answered states
            box.classList.remove('active', 'answered', 'doubtful');
            
            // Apply answered state
            if(this.userAnswers[i] !== undefined) {
                box.classList.add('answered');
            }
            
            // Apply doubtful state
            if(this.doubtfulAnswers.has(i)) {
                box.classList.add('doubtful');
            }
            
            // Apply active state
            if(i === this.currentQuestionIndex) {
                box.classList.add('active');
                box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    jumpToQuestion(index) {
        this.currentQuestionIndex = index;
        this.loadQuestion();
    }

    startTimer() {
        this.timerContainer.style.display = 'flex';
        this.updateTimeDisplay();
        
        clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimeDisplay();
            
            if(this.timeRemaining <= 0) {
                clearInterval(this.timerInterval);
                this.timeRemaining = 0;
                this.updateTimeDisplay();
                alert("Waktu Habis! Ujian otomatis diakhiri.");
                this.finishExam(true); // true means forced finish
            }
        }, 1000);
    }

    updateTimeDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.timeRemaining < 60) {
            this.timerContainer.style.color = 'var(--danger)';
        } else {
            this.timerContainer.style.color = 'var(--primary)';
        }
    }

    loadQuestion() {
        const q = this.questions[this.currentQuestionIndex];
        this.currentQNum.textContent = this.currentQuestionIndex + 1;
        this.questionText.textContent = `${this.currentQuestionIndex + 1}. ${q.text}`;
        
        // Show Category Label if exists
        if(q.category) {
            this.questionCategory.style.display = 'inline-block';
            this.questionCategory.textContent = q.category;
        } else {
            this.questionCategory.style.display = 'none';
        }
        
        // Update progress bar
        const progressPercent = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progressPercent}%`;

        // Load options
        this.optionsContainer.innerHTML = '';
        q.options.forEach((optText, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn option-btn';
            
            // Add alphabetical prefix A, B, C, D, E
            const prefix = String.fromCharCode(65 + index); // 65 is 'A'
            btn.innerHTML = `<strong>${prefix}.</strong> ${optText}`;
            
            if(this.userAnswers[this.currentQuestionIndex] === index) {
                btn.classList.add('selected');
            }
            
            btn.onclick = () => this.selectOption(index, btn);
            this.optionsContainer.appendChild(btn);
        });

        // Button visibility
        this.btnPrev.disabled = this.currentQuestionIndex === 0;
        
        if(this.currentQuestionIndex === this.questions.length - 1) {
            this.btnNext.style.display = 'none';
            this.btnFinish.style.display = 'inline-flex';
        } else {
            this.btnNext.style.display = 'inline-flex';
            this.btnFinish.style.display = 'none';
        }

        this.updateDoubtButton();
        this.updateNavGrid();
    }

    updateDoubtButton() {
        if (!this.btnDoubt) return;
        if (this.doubtfulAnswers.has(this.currentQuestionIndex)) {
            this.btnDoubt.classList.add('active');
            this.btnDoubt.innerHTML = `✔️ Ragu-ragu`;
        } else {
            this.btnDoubt.classList.remove('active');
            this.btnDoubt.innerHTML = `Ragu-ragu`;
        }
    }

    toggleDoubt() {
        if (this.doubtfulAnswers.has(this.currentQuestionIndex)) {
            this.doubtfulAnswers.delete(this.currentQuestionIndex);
        } else {
            this.doubtfulAnswers.add(this.currentQuestionIndex);
        }
        this.updateDoubtButton();
        this.updateNavGrid();
    }

    clearAnswer() {
        if (this.userAnswers[this.currentQuestionIndex] !== undefined) {
            delete this.userAnswers[this.currentQuestionIndex];
            this.doubtfulAnswers.delete(this.currentQuestionIndex);
            this.loadQuestion();
        }
    }

    selectOption(optIndex, btnElement) {
        this.userAnswers[this.currentQuestionIndex] = optIndex;
        
        // Remove selected class from all siblings
        const options = this.optionsContainer.children;
        for(let i=0; i<options.length; i++) {
            options[i].classList.remove('selected');
        }
        
        // Add to clicked
        btnElement.classList.add('selected');
        this.updateNavGrid();
    }

    nextQuestion() {
        if(this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.loadQuestion();
        }
    }

    prevQuestion() {
        if(this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.loadQuestion();
        }
    }

    requestFinishExam() {
        const answeredCount = Object.keys(this.userAnswers).length;
        const totalCount = this.questions.length;

        if (answeredCount < totalCount) {
            const unanswered = totalCount - answeredCount;
            alert(`Peringatan: Masih ada ${unanswered} soal yang belum dijawab!\nSilakan lengkapi jawaban Anda terlebih dahulu menggunakan kotak Navigasi Soal di sebelah kanan.`);
            return;
        }

        const confirmFinish = confirm("Anda sudah menjawab semua soal. Yakin ingin mengakhiri ujian dan melihat hasil?");
        if(confirmFinish) {
            this.finishExam(false);
        }
    }

    finishExam(isForced = false) {
        clearInterval(this.timerInterval);
        this.timerContainer.style.display = 'none';
        this.calculateResult();
        const filterEl = document.getElementById('review-filter');
        if (filterEl) filterEl.value = 'all';
        this.switchScreen(this.resultScreen);
    }

    calculateResult() {
        let correct = 0;
        let wrong = 0;
        let empty = 0;
        let categoryStats = {};
        
        const reviewList = document.getElementById('review-list');
        reviewList.innerHTML = '';

        this.questions.forEach((q, index) => {
            const userAnswer = this.userAnswers[index];
            let isCorrect = false;
            
            const cat = q.category || 'Umum';
            if (!categoryStats[cat]) {
                categoryStats[cat] = { total: 0, correct: 0 };
            }
            categoryStats[cat].total++;
            
            if (userAnswer === undefined || userAnswer === null) {
                empty++;
            } else if (userAnswer === q.correctAnswer) {
                correct++;
                isCorrect = true;
                categoryStats[cat].correct++;
            } else {
                wrong++;
            }

            // Create review item
            const div = document.createElement('div');
            div.className = `review-item ${isCorrect ? 'correct' : (userAnswer === undefined ? 'wrong' : 'wrong')}`;
            
            const pQ = document.createElement('p');
            pQ.className = 'review-q';
            pQ.innerHTML = `<strong>${index + 1}. [${q.category || 'Umum'}]</strong> ${q.text}`;
            
            const pAns = document.createElement('p');
            pAns.className = 'review-ans';
            const userAnsText = userAnswer !== undefined ? q.options[userAnswer] : "Tidak dijawab";
            pAns.innerHTML = `Jawaban Anda: <span style="color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}">${userAnsText}</span>`;
            
            const pKey = document.createElement('p');
            pKey.className = 'review-ans';
            pKey.innerHTML = `Kunci Jawaban: <span style="color: var(--success)">${q.options[q.correctAnswer]}</span>`;
            
            div.appendChild(pQ);
            div.appendChild(pAns);
            div.appendChild(pKey);
            
            if(q.explanation) {
                const pExpl = document.createElement('div');
                pExpl.className = 'review-expl';
                pExpl.innerHTML = `<strong>Pembahasan:</strong> ${q.explanation}`;
                div.appendChild(pExpl);
            }

            reviewList.appendChild(div);
        });

        // Calculate score (out of 100)
        const score = Math.round((correct / this.questions.length) * 100);
        
        document.getElementById('final-score').textContent = score;
        document.getElementById('correct-count').textContent = correct;
        document.getElementById('wrong-count').textContent = wrong;
        document.getElementById('empty-count').textContent = empty;
        
        // Render category breakdown
        const breakdownContainer = document.getElementById('category-breakdown');
        if (breakdownContainer) {
            breakdownContainer.innerHTML = '';
            for (const [cat, stats] of Object.entries(categoryStats)) {
                const percent = Math.round((stats.correct / stats.total) * 100);
                const badge = document.createElement('div');
                badge.style.background = 'rgba(255,255,255,0.7)';
                badge.style.border = '1px solid rgba(0,0,0,0.1)';
                badge.style.borderRadius = '8px';
                badge.style.padding = '8px 12px';
                badge.style.fontSize = '0.9rem';
                badge.innerHTML = `<strong>${cat}</strong>: ${stats.correct}/${stats.total} (${percent}%)`;
                breakdownContainer.appendChild(badge);
            }
        }
    }

    filterReviews() {
        const filterValue = document.getElementById('review-filter').value;
        const reviewItems = document.querySelectorAll('.review-item');
        
        reviewItems.forEach(item => {
            if (filterValue === 'all') {
                item.style.display = 'block';
            } else if (filterValue === 'wrong') {
                if (item.classList.contains('wrong')) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            } else if (filterValue === 'correct') {
                if (item.classList.contains('correct')) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            }
        });
    }

    goHome() {
        clearInterval(this.timerInterval);
        this.timerContainer.style.display = 'none';
        this.switchScreen(this.homeScreen);
    }
}

// Initialize App
const app = new ExamApp();
