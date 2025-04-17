
function criarElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Restart(){
    this.elemento = criarElemento('div','recomecar')

    const botao = criarElemento('img')
    botao.src = 'https://img.icons8.com/external-becris-lineal-becris/64/000000/external-refresh-mintab-for-ios-becris-lineal-becris.png'

    botao.onclick = () =>{
        document.location.reload(true)
    }

    this.elemento.appendChild(botao)
}

function Faixa(y) {
    this.elemento = criarElemento("div", "faixa")

    this.getAltura = () => this.elemento.clientHeight

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    this.setY(y)
}

function Faixas(alturaJogo, espaco){
    this.faixas = [
        new Faixa(alturaJogo),
        new Faixa(alturaJogo + espaco),
        new Faixa(alturaJogo + espaco * 2),
        new Faixa(alturaJogo + espaco * 3),
        new Faixa(alturaJogo + espaco * 4),
        new Faixa(alturaJogo + espaco * 5),
        new Faixa(alturaJogo + espaco * 6),
        new Faixa(alturaJogo + espaco * 7),
        new Faixa(alturaJogo + espaco * 8)
    ]

    const des = 5

    this.animar = () => {
        this.faixas.forEach(faixa => {
            faixa.setY(faixa.getY() - des)
            if(faixa.getY() < -faixa.getAltura()){
                faixa.setY(faixa.getY() + espaco * this.faixas.length)
            }
        })
    }
}

function CarroInimigo(x) {
    this.elemento = criarElemento('img', 'car-enemy')
    this.elemento.src = `./.github/images/pixel-car${Math.floor(Math.random() * (4 - 1)) + 1}.png`
    
    this.sortearPosicao = () => {
        const posicao = Math.random() * (390 - 0)
        this.elemento.style.left = `${posicao}px`
    }

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])

    this.setY = y => this.elemento.style.bottom = `${y}px`

    this.getAltura = () => this.elemento.clientHeight

    this.sortearPosicao()
    this.setY(x)

}

function Carros(altura, espaco) {
    this.cars = [
        new CarroInimigo( altura),
        new CarroInimigo( altura + espaco),
        new CarroInimigo( altura + espaco * 2),
        new CarroInimigo( altura + espaco * 3),
        new CarroInimigo( altura + espaco * 4)
    ]

    const deslocamento = 4
    this.animar = () => {
        this.cars.forEach(car => {
            car.setY(car.getY() - deslocamento)
            if (car.getY() < -car.getAltura()) {
                car.setY(car.getY() + espaco * this.cars.length)
                car.sortearPosicao()
            }
        })
    }
}

function PlayerCar(alturaJogo, larguraJogo) {
    let comando = ''
    this.setaEsquerda = criarElemento('div','triangulo-para-esquerda')
    this.setaDireita = criarElemento('div','triangulo-para-direita')
    this.elemento = criarElemento("img", "car-player")
    this.elemento.src = "./.github/images/player.png"


    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
    this.setX = x => this.elemento.style.left = `${x}px`

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    this.setaDireita.ontouchstart = e =>{
        comando = 'right'
        this.elemento.style.transform = 'rotate(20deg)'
    }
    this.setaEsquerda.ontouchstart = e =>{
        comando = 'left'
        this.elemento.style.transform = 'rotate(-20deg)'
    }

    this.setaDireita.ontouchend = e =>{
        comando = 'f'
        this.elemento.style.transform = 'rotate(0)'
    }
    this.setaEsquerda.ontouchend = e =>{
        comando = 'f'
        this.elemento.style.transform = 'rotate(0)'
    }


    window.onkeydown = e => {
        if (e.keyCode == '37') {
            this.setaEsquerda.style.borderRight = '40px solid yellow'
            comando = "left"
            this.elemento.style.transform = 'rotate(-20deg)'
        } else if (e.keyCode == '39') {
            this.setaDireita.style.borderLeft = '40px solid yellow'
            comando = "right"
            this.elemento.style.transform = 'rotate(20deg)'
        }
    }

    window.onkeyup = e => {
        this.setaDireita.style.borderLeft = '40px solid #ABA8B2'
        this.setaEsquerda.style.borderRight = '40px solid #ABA8B2'
        comando = "f"
        this.elemento.style.transform = 'rotate(0)'
    }

    novoX = this.getX()
    this.animar = () => {
        if (comando == "left") {
            // console.log("p")
            novoX = this.getX() + -5
        } else if (comando == "right") {
            novoX = this.getX() + 5
        }

        const larguraMaxima = larguraJogo - this.elemento.clientWidth

        if (novoX <= 0) {
            this.setX(0)
        } else if (novoX >= larguraMaxima) {
            this.setX(larguraMaxima)
        } else if (novoX < larguraJogo) {
            this.setX(novoX)
        }
    }

    this.setY(alturaJogo / 4)
    this.setX(larguraJogo / 2)
}

function estaoSobrepostos(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left

    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical
}

function colidiu(carroPlayer, carrosEnemy){
    let colidiu = false
    carrosEnemy.cars.forEach(car => {
        if(!colidiu){
            const corpo = car.elemento
        
            colidiu = estaoSobrepostos(carroPlayer.elemento, corpo)
        }
    })
    return colidiu
}


function PixelCar(){

    const areaDoJogo = document.querySelector('[racer]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const carrosEnemy = new Carros(altura,500)
    const carroPlayer = new PlayerCar(altura,largura)
    const faixasJogo = new Faixas(0,200)
    const restart = new Restart()

    faixasJogo.faixas.forEach(faixa => {
        areaDoJogo.appendChild(faixa.elemento)
    })
    areaDoJogo.appendChild(carroPlayer.elemento)
    areaDoJogo.appendChild(carroPlayer.setaDireita)
    areaDoJogo.appendChild(carroPlayer.setaEsquerda)
    carrosEnemy.cars.forEach(car => {
        areaDoJogo.appendChild(car.elemento)
    })

    this.comecar = () => {
        const temp = setInterval(() => {
            carrosEnemy.animar()
            carroPlayer.animar()
            faixasJogo.animar()

            if(colidiu(carroPlayer,carrosEnemy)){
                clearInterval(temp)
                areaDoJogo.appendChild(restart.elemento)
            }
        },20)
    }
}


new PixelCar().comecar()
