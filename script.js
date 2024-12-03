document.addEventListener('mousemove', (e) => {
    const cursorTrail = document.querySelector('.cursor-trail');
    const cursorGlow = document.querySelector('.cursor-trail-glow');
    
    // Update the position of both elements based on cursor's position
    cursorTrail.style.left = `${e.pageX}px`;
    cursorTrail.style.top = `${e.pageY}px`;
  
    cursorGlow.style.left = `${e.pageX}px`;
    cursorGlow.style.top = `${e.pageY}px`;
  });
  
  document.addEventListener('DOMContentLoaded', () => {
    // Create the main cursor
    const cursorTrail = document.createElement('div');
    cursorTrail.classList.add('cursor-trail');
    document.body.appendChild(cursorTrail);
  
    // Create the glowing trail element
    const cursorGlow = document.createElement('div');
    cursorGlow.classList.add('cursor-trail-glow');
    document.body.appendChild(cursorGlow);
  });
  