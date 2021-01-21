import React, { Component } from "react";
//import { useFrame } from "react-three-fiber";
import * as THREE from "three";

import five from "./five.png";

class Box extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      active: false,
      setActive: false,
      frame: 0,
      totalFrames: 0,
    };
    this.setActive = this.setActive.bind(this);
    this.meshRef = React.createRef();
  }

  componentDidMount() {
    this.setState({
      totalFrames: this.props.data.data.length,
      frame: this.props.frame,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.frame !== this.props.frame) {
      let curFrame = this.props.frame % this.state.totalFrames;
      let curData = this.props.data.data[curFrame];

      this.setState({
        rotationX: this.state.rotationX + parseFloat(curData[0]),
        rotationY: this.state.rotationX + parseFloat(curData[1]),
        rotationZ: this.state.rotationX + parseFloat(curData[2]),
      });
    }

    if (prevState.rotationX !== this.state.rotationX) {
      this.meshRef.current.rotation.x = this.state.rotationX;
    }
    if (prevState.rotationY !== this.state.rotationY) {
      this.meshRef.current.rotation.y = this.state.rotationY;
    }
    if (prevState.rotationZ !== this.state.rotationZ) {
      this.meshRef.current.rotation.z = this.state.rotationZ;
    }
  }

  handleData(data) {
    return data.length;
  }

  setActive(active) {
    this.setState({ active: active });
  }

  setTexture() {
    return new THREE.TextureLoader().load(five);
  }

  render() {
    return (
      <mesh
        {...this.props}
        ref={this.meshRef}
        scale={this.state.active ? [2, 2, 2] : [1.5, 1.5, 1.5]}
        onClick={(e) => this.setActive(!this.state.active)}
      >
        <boxBufferGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial
          attach="material"
          transparent
          side={THREE.DoubleSide}
        >
          <primitive attach="map" object={this.setTexture()} />
        </meshBasicMaterial>
      </mesh>
    );
  }
}

export default Box;
