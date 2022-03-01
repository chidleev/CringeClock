import * as THREE from 'three'
import {OrbitControls} from 'OrbitControls'
import {FlakesTexture} from 'FlakesTexture'

const elementSize = 5
const pi = 3.14159265359
const scene = new THREE.Scene()
const elementStatus = [
    [0, 0, 0, 0, 0, 0, 1], //0
    [1, 0, 0, 1, 1, 1, 1], //1
    [0, 0, 1, 0, 0, 1, 0], //2
    [0, 0, 0, 0, 1, 1, 0], //3
    [1, 0, 0, 1, 1, 0, 0], //4
    [0, 1, 0, 0, 1, 0, 0], //5
    [0, 1, 0, 0, 0, 0, 0], //6
    [0, 0, 0, 1, 1, 1, 1], //7
    [0, 0, 0, 0, 0, 0, 0], //8
    [0, 0, 0, 0, 1, 0, 0]  //9
]

const renderer = new THREE.WebGLRenderer({
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x204040)
document.body.appendChild(renderer.domElement)


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 0, 200)

const controls = new OrbitControls(camera, document.body)
controls.enableDamping = true


const ambient = new THREE.AmbientLight(0x204040, 1)
scene.add(ambient)

const dirLight = new THREE.DirectionalLight(0xffffff, 1)
dirLight.position.set(0, 0, 100)
scene.add(dirLight)


const number = new ClockNumber()
scene.add(number.elementsMeshes)


function Element() {
    this.shape = new THREE.Shape()

    this.shape.moveTo(0, - elementSize * 2)
    this.shape.lineTo(elementSize * 4, - elementSize * 2)
    this.shape.lineTo(elementSize * 6, 0)
    this.shape.lineTo(elementSize * 4, elementSize * 2)
    this.shape.lineTo(- elementSize * 4, elementSize * 2)
    this.shape.lineTo(- elementSize * 6, 0)
    this.shape.lineTo(- elementSize * 4, - elementSize * 2)

    this.geometry = new THREE.ExtrudeBufferGeometry(this.shape, {depth: elementSize/2, bevelEnabled: false})
    this.geometry.translate(0, 0, -elementSize/4)

    this.mesh = new THREE.Mesh(
        this.geometry, 
        [
            new THREE.MeshPhongMaterial({color: 0xffffff}),
            new THREE.MeshPhongMaterial({color: 0x408080})
        ]
    );

    this.isVertical = 0
}

function ClockNumber() {
    this.elementsMeshes = new THREE.Group();

    this.elements = []
    for (let i = 0; i < 7; i++) {
        this.elements[i] = new Element()
    }
    
    this.elements[0] = new Element()
    this.elements[0].mesh.translateOnAxis(new THREE.Vector3(0, 1, 0), elementSize * 12)
    this.elements[0].mesh.setRotationFromEuler(new THREE.Euler(elementStatus[0][0] * pi/2, 0, pi/2 * this.elements[0].isVertical, "ZXY"))
    this.elementsMeshes.add(this.elements[0].mesh)

    this.elements[1] = new Element()
    this.elements[1].isVertical = 1
    this.elements[1].mesh.translateOnAxis(new THREE.Vector3(1, 1, 0), elementSize * 6)
    this.elements[1].mesh.setRotationFromEuler(new THREE.Euler(elementStatus[0][1] * pi/2, 0, pi/2 * this.elements[1].isVertical, "ZXY"))
    this.elementsMeshes.add(this.elements[1].mesh)

    this.elements[2] = new Element()
    this.elements[2].isVertical = 1
    this.elements[2].mesh.translateOnAxis(new THREE.Vector3(1, -1, 0), elementSize * 6)
    this.elements[2].mesh.setRotationFromEuler(new THREE.Euler(elementStatus[0][2] * pi/2, 0, pi/2 * this.elements[2].isVertical, "ZXY"))
    this.elementsMeshes.add(this.elements[2].mesh)

    this.elements[3] = new Element()
    this.elements[3].mesh.translateOnAxis(new THREE.Vector3(0, -1, 0), elementSize * 12)
    this.elements[3].mesh.setRotationFromEuler(new THREE.Euler(elementStatus[0][3] * pi/2, 0, pi/2 * this.elements[3].isVertical, "ZXY"))
    this.elementsMeshes.add(this.elements[3].mesh)

    this.elements[4] = new Element()
    this.elements[4].isVertical = 1
    this.elements[4].mesh.translateOnAxis(new THREE.Vector3(-1, -1, 0), elementSize * 6)
    this.elements[4].mesh.setRotationFromEuler(new THREE.Euler(elementStatus[0][4] * pi/2, 0, pi/2 * this.elements[4].isVertical, "ZXY"))
    this.elementsMeshes.add(this.elements[4].mesh)

    this.elements[5] = new Element()
    this.elements[5].isVertical = 1
    this.elements[5].mesh.translateOnAxis(new THREE.Vector3(-1, 1, 0), elementSize * 6)
    this.elements[5].mesh.setRotationFromEuler(new THREE.Euler(elementStatus[0][5] * pi/2, 0, pi/2 * this.elements[5].isVertical, "ZXY"))
    this.elementsMeshes.add(this.elements[5].mesh)

    this.elements[6] = new Element()
    this.elements[6].mesh.setRotationFromEuler(new THREE.Euler(elementStatus[0][6] * pi/2, 0, pi/2 * this.elements[6].isVertical, "ZXY"))
    this.elementsMeshes.add(this.elements[6].mesh)

    this.speed = 3

    this.setStatus = function(time) {
        this.elements.forEach((element, id) => {
            const fract = time - Math.trunc(time)
            const angle = (elementStatus[Math.trunc(time) % 10][id] * (1 - fract * this.speed) + elementStatus[Math.trunc(time + 1) % 10][id] * fract * this.speed) * pi/2
            if (fract <= 1/this.speed) element.mesh.setRotationFromEuler(new THREE.Euler(angle, 0, pi/2 * element.isVertical, "ZXY"))
            else element.mesh.setRotationFromEuler(new THREE.Euler(elementStatus[Math.trunc(time + 1) % 10][id] * pi/2, 0, pi/2 * element.isVertical, "ZXY"))
        })
        
    }
}

renderer.setAnimationLoop((time) => {
    //console.log(time/1000)
    controls.update()
    number.setStatus(time/1000)
    renderer.render(scene, camera)
})


window.addEventListener('resize', resize);

function resize()
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}