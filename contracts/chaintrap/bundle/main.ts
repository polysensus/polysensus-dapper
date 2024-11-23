// Note: this file exists to facilitate bundling the abi via vite's vanila template
import './style.css'

// NOTICE: the abi file in the bundle/ directory is a stub that is replaced by
// the actual abi file during the build process.  the actual abi is copied into
// the dist by pointing the vite public dir at the forge output directory for
// the arena.sol abi.
import * as abi from './ChaintrapArena.json';

export type Foo ={
  bar: string;
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>ABI</h1>
    ${JSON.stringify(abi)}
  </div>
`