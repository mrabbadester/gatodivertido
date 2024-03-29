//criar variáveis e função que carrega imagens
var canvas, ctx, altura, largura, frames = 0, maxPulos = 3, velocidade = 6,
	estadoAtual,record,

    estados = {
		jogar: 0,
		jogando: 1,
		perdeu: 2
	},
	chao = {
		y: 550,
		altura: 50,
		cor: "#ffdf70",
		desenha:  function() {
			ctx.fillStyle = this.cor;
			ctx.fillRect(0, this.y, largura, this.altura);
		}
	},
	bloco = {
		x: 50,
		y: 0,
		altura: 50,
		largura: 80,
		cor: "#ff9239",
		gravidade: 1.5,
		velocidade: 0,
		forcaDoPulo: 23.6,
		qtPulos: 0,
		score: 0,
		atualiza: function() {
			this.velocidade += this.gravidade;
			this.y += this.velocidade;
			if (this.y > chao.y -this.altura && estadoAtual != estados.perdeu) {
				this.y = chao.y - this.altura
				this.qtPulos = 0;
				this.velocidade = 0;

			};
		},
		reset: function () {
			this.velocidade = 0;
			this.y = 0;
			if (this.score > record) {
				localStorage.setItem("record", this.score);
				record = this.score;
			};
			this.score = 0;
		},
		pula: function () {
			if (this.qtPulos < maxPulos) {
				this.velocidade = -this.forcaDoPulo;
				this.qtPulos++;
			};
		},
		desenha: function() {
			// ctx.fillStyle = this.cor;
			// ctx.fillRect(this.x, this.y, this.largura, this.altura);
			var img = document.getElementById("personagem");
    		ctx.drawImage(img,this.x, this.y, this.largura, this.altura);

		}
	},

    estados = {
		jogar: 0,
		jogando: 1,
		perdeu: 2
	},
	chao = {
		y: 550,
		altura: 50,
		cor: "#ffdf70",
		desenha:  function() {
			ctx.fillStyle = this.cor;
			ctx.fillRect(0, this.y, largura, this.altura);
		}
	},
	bloco = {
		x: 50,
		y: 0,
		altura: 50,
		largura: 80,
		cor: "#ff9239",
		gravidade: 1.5,
		velocidade: 0,
		forcaDoPulo: 23.6,
		qtPulos: 0,
		score: 0,
		atualiza: function() {
			this.velocidade += this.gravidade;
			this.y += this.velocidade;
			if (this.y > chao.y -this.altura && estadoAtual != estados.perdeu) {
				this.y = chao.y - this.altura
				this.qtPulos = 0;
				this.velocidade = 0;

			};
		},
		reset: function () {
			this.velocidade = 0;
			this.y = 0;
			if (this.score > record) {
				localStorage.setItem("record", this.score);
				record = this.score;
			};
			this.score = 0;
		},
		pula: function () {
			if (this.qtPulos < maxPulos) {
				this.velocidade = -this.forcaDoPulo;
				this.qtPulos++;
			};
		},
		desenha: function() {
			// ctx.fillStyle = this.cor;
			// ctx.fillRect(this.x, this.y, this.largura, this.altura);
			var img = document.getElementById("personagem");
    		ctx.drawImage(img,this.x, this.y, this.largura, this.altura);

		}
	},
	obstaculos = {
		_obs: [],
		cores: ["#afa", "#cce", "#ffa", "#ada", ],
		tempoInsere: 0,

		insere: function() {
			this._obs.push({
				x: largura,
				// largura: 20 + Math.floor(21 * Math.random()),
				largura: 50,
				altura: 30 + Math.floor(80 * Math.random()),
				cor: this.cores[Math.floor(3 * Math.random())]
			});

			this.tempoInsere = 50 + Math.floor(51 * Math.random());
		},
		atualiza: function() {
			if (this.tempoInsere == 0) {
				this.insere();
			} else {
				this.tempoInsere--;
			}
			
			for (var i = 0, tam = this._obs.length; i < tam; i++) {
				var obs = this._obs[i];

				obs.x -= velocidade;

				if (bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >= obs.x && bloco.y + bloco.altura >= chao.y - obs.altura) {
					estadoAtual = estados.perdeu;
				} else if (obs.x == 0) {
					bloco.score++;
				} else if (obs.x <= -obs.largura) {
					this._obs.splice(i, 1);
					tam--;
					i--;
				};
			};
		},
		limpa: function () {
			this._obs = [];
		},
		desenha: function() {
			for (var i = 0, tam = this._obs.length; i < tam; i++) {
				var obs = this._obs[i];
				ctx.fillStyle = obs.cor;
				ctx.fillRect(obs.x, chao.y-obs.altura, obs.largura, obs.altura);
			};

		}
	};


//função que inicializa o arquivo
{
    function main(){
        altura = window.innerHeight;
        largura = window.innerWidth;
        if (largura >= 1000) {
            largura = 1500;
            altura = 600;
        }
    
        canvas = document.createElement("canvas");
        canvas.width = largura;
        canvas.height = altura;
        canvas.style.border = "20px solid #000";
    
        ctx = canvas.getContext("2d");
        document.body.appendChild(canvas);
        document.addEventListener("mousedown", clique);
    
        estadoAtual = estados.jogar;
        record = localStorage.getItem("record");
        if (record == null) {
            record = 0;
        }
        roda();
    }
    
    function clique(e){
        if (estadoAtual == estados.jogando) {
            bloco.pula();
        } else if (estadoAtual == estados.jogar) {
            estadoAtual = estados.jogando
        } else if (estadoAtual == estados.perdeu && bloco.y >= 2 * altura) {
            estadoAtual = estados.jogar;
            obstaculos.limpa();
            bloco.reset();
        }
    }
}

//função que executa o programa até que seja parado
function roda() {
	atualiza();
	desenha();

	window.requestAnimationFrame(roda);
}

function atualiza() {
	frames++;
	bloco.atualiza();

	if (estadoAtual == estados.jogando) {
		obstaculos.atualiza();
	};
}

function desenha() {
	ctx.fillStyle = "#DCDCDC";
	ctx.fillRect(0, 0, largura, altura);

	ctx.fillStyle = "#fff";
	ctx.font = "50px Arial";
	ctx.fillText(bloco.score, 30, 68);

	if (estadoAtual == estados.jogar) {
		ctx.fillStyle = "green";
		ctx.fillRect(largura/2-50, altura/2-50, 100, 100);
	} else if (estadoAtual == estados.perdeu) {
		ctx.fillStyle = "red";
		ctx.fillRect(largura/2-50, altura/2-50, 100, 100);
		
		ctx.save();
		ctx.translate(largura/2, altura/2);
		ctx.fillStyle = "#fff";
		ctx.fillText(bloco.score, -ctx.measureText(bloco.score).width/2, 19);
		ctx.restore();

	} else if (estadoAtual == estados.jogando) {
		obstaculos.desenha();
	};

	chao.desenha();
	bloco.desenha();
}

// inicializa o jogo
main();