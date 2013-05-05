/**
 * @author mrdoob / http://mrdoob.com/
 * @author DLar / https://github.com/dlar
 */

THREE.WalkControls = function ( camera ) {

	var scope = this;
	var RMB = false;

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 55; //Eye Level
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var rotateStart = new THREE.Vector2();
	var rotateEnd = new THREE.Vector2();
	var rotateDelta = new THREE.Vector2();
	var movementX = 0;
	var movementY = 0;

	var projector = new THREE.Projector();
	var vector, raycaster, intersects, INTERSECTED, items = [];

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var onMouseDown = function ( event ) {

		event.preventDefault();
		if ( scope.enabled === false ) return;

		if ( event.button === 0 ) {

			if ( intersects.length > 0 ) {

				for ( var i = 0; i < items.length; i++ ) {

					if ( items[i].id == intersects[0].object.id ) {

						instructions.innerHTML = '<span style="font-size:50px">Box ' + (i+1) + '</span><br />(Click to Resume)';
						blocker.style.display = 'block';

						scope.enabled = false;
						break;

					}

				}

			}

		}

		else if ( event.button === 2 ) {

			RMB = true;
			rotateStart.set( event.clientX, event.clientY );

		}

	};

	var onMouseUp = function ( event ) {

		event.preventDefault();
		if ( scope.enabled === false ) return;

		RMB = false;

	};

	var onMouseMove = function ( event ) {

		event.preventDefault();
		if ( scope.enabled === false ) return;

		vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 1 );
		raycaster = projector.pickingRay( vector, camera );
		raycaster.far = 48; //picking distance from camera
		intersects = raycaster.intersectObjects( items );

		if ( intersects.length > 0 ) {

			if ( INTERSECTED != intersects[ 0 ].object ) {

				if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

				INTERSECTED = intersects[ 0 ].object;
				INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
				INTERSECTED.material.emissive.setHex( 0xffff00 );

			}

			document.body.style.cursor = 'pointer';

		} else {

			if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

			INTERSECTED = null;

			document.body.style.cursor = 'auto';

		}

		if ( RMB == true ) {

			rotateEnd.set( event.clientX, event.clientY );
			rotateDelta.subVectors( rotateEnd, rotateStart );

			movementX -= ( Math.PI * rotateDelta.x / 4000);
			movementY -= ( Math.PI * rotateDelta.y / 4000);

			yawObject.rotation.y -= movementX;
			pitchObject.rotation.x -= movementY;

			pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

			rotateStart.copy( rotateEnd );

		}

	};

	var onKeyDown = function ( event ) {

		event.preventDefault();
		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ moveRight = true; break;

			case 27: /*Esc*/
			case 80: /*P*/
				if ( scope.enabled === false ) {

					blocker.style.display = 'none';

				} else {

					instructions.innerHTML = '<span style="font-size:50px">Paused</span><br />(Click to Resume)';
					blocker.style.display = 'block';

				}

				scope.enabled = !scope.enabled; break;

		}

	};

	var onKeyUp = function ( event ) {

		event.preventDefault();
		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ moveRight = false; break;

		}

	};

	document.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'mousedown', onMouseDown, false );
	document.addEventListener( 'mouseup', onMouseUp, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.addItem = function ( obj ) {

		items.push( obj );

	};

	this.update = function ( delta ) {

		if ( scope.enabled === false ) return;

		delta *= 0.1;

		velocity.x += ( - velocity.x ) * 0.05 * delta;
		velocity.z += ( - velocity.z ) * 0.05 * delta;

		if ( moveForward ) velocity.z -= 0.1 * delta;
		if ( moveBackward ) velocity.z += 0.1 * delta;

		if ( moveLeft ) velocity.x -= 0.1 * delta;
		if ( moveRight ) velocity.x += 0.1 * delta;

		yawObject.translateX( velocity.x );
		yawObject.translateZ( velocity.z );

		movementX = 0;
		movementY = 0;

	};

};