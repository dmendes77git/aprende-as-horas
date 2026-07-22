# Aprende as Horas! ⏰ (Interactive Portuguese Time Teacher)

Um jogo educativo e interativo projetado para ensinar crianças e estudantes a ler as horas em relógios analógicos e digitais em **Português Europeu (`pt-PT`)**.

![Aprende as Horas](https://img.shields.io/badge/Language-Portuguese%20%28pt--PT%29-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🚀 Versões do Projeto

### 🌐 1. Aplicação Web Interativa (HTML5 / CSS3 / JavaScript)
Localizada em [`web/`](./web):
- **Relógio Analógico Canvas**: Ponteiros interativos de Horas (Vermelho) e Minutos (Azul) com arrastar e soltar (drag-and-drop) adaptativo para ecrãs táteis e rato.
- **Voz em Português Europeu (`pt-PT`)**: Motor de síntese de voz nativo (Web Speech API) com pronúncia correta (*"É meio-dia em ponto!"*, *"São três e um quarto da tarde"*, *"Faltam quinze minutos para as quatro"*).
- **Efeitos Sonoros & Fogos de Artifício**: Motor de partículas em Canvas para celebrações a cada resposta correta.
- **3 Modos de Jogo**:
  - 🎯 **Modo Treino**: Ajustar os ponteiros para a hora pedida.
  - ❓ **Modo Adivinha**: Escolher a opção digital correta a partir do relógio analógico.
  - ⚡ **Modo Desafio 60s**: Jogo contra o tempo de 60 segundos.

#### Como Executar a Versão Web:
Abra o ficheiro `web/index.html` em qualquer navegador web, ou execute o servidor local:
```powershell
python -m http.server 8000 --directory web
```
E aceda a `http://localhost:8000`.

---

### 🐍 2. Aplicação Desktop Kivy (Python)
Localizada em [`time_teacher_app.py`](./time_teacher_app.py):
- Aplicação desktop interativa desenvolvida em Python usando Kivy framework.
- Ponteiros interativos, alternância AM/PM, cálculo de ângulos de horas e sistema de pontuação.

#### Como Executar a Versão Kivy:
```powershell
pip install kivy
python time_teacher_app.py
```

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 Canvas API** (Renderização gráfica do relógio e partículas)
- **Vanilla CSS3** (Design System Glassmorphism & Temas dinâmicos AM/PM)
- **JavaScript (ES6+)** (Lógica do jogo e eventos táteis)
- **Web Speech API & Web Audio API** (Voz `pt-PT` e sintetizador de som)
- **Python & Kivy Framework** (Versão desktop)

---

## 📄 Licença
Distribuído sob a licença MIT. Veja `LICENSE` para mais detalhes.
