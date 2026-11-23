import './style.css';


import * as THREE from 'three';

import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import TWEEN from 'three/addons/libs/tween.module.js';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { loadPeople, getNetWorthColor } from './data.js';

const GOOGLE_SHEETS_SCOPE =
  'https://www.googleapis.com/auth/spreadsheets.readonly';

let tokenClient;
let accessToken = null;

loadPeople()
  .then(people => {
    console.log('First person:', people[0]);
    console.log('Total people:', people.length);
  })
  .catch(error => {
    console.error('Error loading people:', error);
  });

let camera, scene, renderer;
let controls;

const objects = [];
const targets = { table: [], sphere: [], helix: [], grid: [] };

const loginButton = document.getElementById('google-login');
const loginStatus = document.getElementById('login-status');

loginButton.addEventListener('click', () => {
  if (!window.google?.accounts?.oauth2) {
    loginStatus.textContent =
      'Google library is still loading. Please try again.';
    return;
  }

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: GOOGLE_SHEETS_SCOPE,

    callback: async (response) => {
      if (response.error) {
        loginStatus.textContent =
          'Authorization failed: ' + response.error;
        return;
      }

      accessToken = response.access_token;

      loginStatus.textContent = 'Loading spreadsheet data...';
      loginButton.disabled = true;

      try {
        await init(accessToken);
        animate();

        document.getElementById('login').style.display = 'none';

        console.log('Visualization initialized successfully.');
      } catch (error) {
        console.error('Failed to initialize visualization:', error);

        loginStatus.textContent =
          'Failed to load spreadsheet: ' + error.message;

        loginButton.disabled = false;
      }
    },

    error_callback: (error) => {
      loginStatus.textContent =
        'Google authorization popup failed.';
      console.error(error);
    }
  });

  tokenClient.requestAccessToken();
});

async function init(accessToken) {

  const people = await loadPeople(accessToken);

  camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 3000;

  scene = new THREE.Scene();

  // table

  // Create one card for each person

  for (let i = 0; i < people.length; i++) {

    const person = people[i];

    const element = document.createElement('div');
    element.className = 'element';

    // Set card background based on net worth
    const color = getNetWorthColor(person.netWorth);

    const colors = {
      red: '#EF3022',
      orange: '#FDCA35',
      green: '#3A9F48'
    };
    element.style.backgroundColor = colors[color];

    // Person's photo

    // Card header: country and age
    const header = document.createElement('div');
    header.className = 'card-header';

    const country = document.createElement('span');
    country.textContent = person.country;

    const age = document.createElement('span');
    age.textContent = person.age;

    header.appendChild(country);
    header.appendChild(age);
    element.appendChild(header);

    // Person's photo
    const photo = document.createElement('img');
    photo.src = person.photo;
    photo.alt = person.name;
    photo.className = 'person-photo';
    element.appendChild(photo);

    // Person's name
    const name = document.createElement('div');
    name.className = 'person-name';
    name.textContent = person.name;
    element.appendChild(name);

    // Person's interest
    const interest = document.createElement('div');
    interest.className = 'person-interest';
    interest.textContent = person.interest;
    element.appendChild(interest);


    // Create Three.js CSS3D object
    const objectCSS = new CSS3DObject(element);

    objectCSS.position.x = Math.random() * 4000 - 2000;
    objectCSS.position.y = Math.random() * 4000 - 2000;
    objectCSS.position.z = Math.random() * 4000 - 2000;

    scene.add(objectCSS);
    objects.push(objectCSS);

    // Table layout: 20 columns x 10 rows
    const object = new THREE.Object3D();

    object.position.x = (i % 20) * 140 - 1330;
    object.position.y = -(Math.floor(i / 20) * 180) + 810;

    targets.table.push(object);
  }

  // sphere

  const vector = new THREE.Vector3();

  for (let i = 0, l = objects.length; i < l; i++) {

    const phi = Math.acos(- 1 + (2 * i) / l);
    const theta = Math.sqrt(l * Math.PI) * phi;

    const object = new THREE.Object3D();

    object.position.setFromSphericalCoords(800, phi, theta);

    vector.copy(object.position).multiplyScalar(2);

    object.lookAt(vector);

    targets.sphere.push(object);

  }



  // Double helix

  const helixRadius = 550;
  const angleStep = 0.18;
  const verticalSpacing = 16;

  for (let i = 0; i < objects.length; i++) {

    const object = new THREE.Object3D();

    // Alternate between two strands
    const strand = i % 2;

    // Position within each strand
    const step = Math.floor(i / 2);

    // Rotate second strand by 180 degrees
    const theta = step * angleStep + strand * Math.PI;

    // Increase vertical separation
    const y = 800 - step * verticalSpacing;

    object.position.setFromCylindricalCoords(
      helixRadius,
      theta,
      y
    );

    // Face cards outward
    vector.copy(object.position).multiplyScalar(2);
    object.lookAt(vector);

    targets.helix.push(object);
  }


  // grid

  for (let i = 0; i < objects.length; i++) {

    const object = new THREE.Object3D();

    object.position.x = ((i % 5) * 400) - 800;
    object.position.y = (- (Math.floor(i / 5) % 4) * 400) + 800;
    object.position.z = (Math.floor(i / 20)) * 1000 - 2000;

    targets.grid.push(object);

  }

  //

  renderer = new CSS3DRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('container').appendChild(renderer.domElement);

  //

  controls = new TrackballControls(camera, renderer.domElement);
  controls.minDistance = 500;
  controls.maxDistance = 12000;
  controls.addEventListener('change', render);

  const buttonTable = document.getElementById('table');
  buttonTable.addEventListener('click', function () {

    transform(targets.table, 2000);

  });

  const buttonSphere = document.getElementById('sphere');
  buttonSphere.addEventListener('click', function () {

    transform(targets.sphere, 2000);

  });

  const buttonHelix = document.getElementById('helix');
  buttonHelix.addEventListener('click', function () {

    transform(targets.helix, 2000);

  });

  const buttonGrid = document.getElementById('grid');
  buttonGrid.addEventListener('click', function () {

    transform(targets.grid, 2000);

  });

  transform(targets.table, 2000);

  //

  window.addEventListener('resize', onWindowResize);

}

function transform(targets, duration) {

  TWEEN.removeAll();

  for (let i = 0; i < objects.length; i++) {

    const object = objects[i];
    const target = targets[i];

    new TWEEN.Tween(object.position)
      .to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

    new TWEEN.Tween(object.rotation)
      .to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .start();

  }

  new TWEEN.Tween(this)
    .to({}, duration * 2)
    .onUpdate(render)
    .start();

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  render();

}

function animate() {

  requestAnimationFrame(animate);

  TWEEN.update();

  controls.update();

}

function render() {

  renderer.render(scene, camera);

}
