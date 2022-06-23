gsap.registerPlugin(ScrollTrigger);


const w = window.innerWidth;
const h = window.innerHeight;

const views = [
  { bottom: 0, height: 1 },
  { bottom: 0, height: 0 }
];

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
		
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild( renderer.domElement );

// scene
const scene = new THREE.Scene();

views.forEach((view, i) => {
  view.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
  view.camera.position.fromArray([0, 0, 180] );
  view.camera.layers.disableAll();
  view.camera.layers.enable( i );
  view.camera.lookAt(new THREE.Vector3(0, 5, 0));
});

//light
const light = new THREE.AmbientLight( 0x404040, 1.5 )
scene.add( light );

// group
const sphereGeometry = new THREE.SphereGeometry(20, 62, 62)
const sphereMaterila = new THREE.MeshStandardMaterial({color: new THREE.Color('#0000ff')})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterila)

const onResize = () => 
{ 
  views.forEach(view => {
    view.camera.aspect = w / h;
    view.camera.updateProjectionMatrix();
  });

  renderer.setSize( w, h );		
  render();
}
window.addEventListener( 'resize', onResize, false );

const line = new THREE.LineSegments( sphere.geometry );

const modelGroup = new THREE.Group();

sphere.layers.set( 0 );
line.layers.set( 1 );
  
modelGroup.add(sphere);
modelGroup.add(line);
scene.add(modelGroup);

render = () =>
{
    views.forEach(view => {
      const bottom = Math.floor( h * view.bottom );
      const height = Math.floor( h * view.height );
  
      renderer.setViewport( 0, 0, w, h );
      renderer.setScissor( 0, bottom, w, height );
      renderer.setScissorTest( true );
  
      view.camera.aspect = w / h;
      renderer.render( scene, view.camera );
    });
}

render();

const sectionDuration = 1;
gsap.fromTo(views[1], 
{ 	height: 1, bottom: 0 }, 
{
  height: 0, bottom: 1,
  ease: 'none',
  scrollTrigger: 
  {
    trigger: ".blueprint",
    scrub: true,
    start: "bottom bottom",
    end: "bottom top"
  }
})

gsap.fromTo(views[1], 
{ 	height: 0, bottom: 0 }, 
{
  height: 1, bottom: 0,
  ease: 'none',
  scrollTrigger: 
  {
    trigger: ".blueprint",
    scrub: true,
    start: "top bottom",
    end: "top top"
  }
})

const tl = new gsap.timeline(
{
onUpdate: render,
scrollTrigger: 
{
  trigger: ".content",
  scrub: true,
  start: "top top",
  end: "bottom bottom"
},
defaults: {duration: sectionDuration, ease: 'power2.inOut'}
});

tl.to(light, {duration: sectionDuration})