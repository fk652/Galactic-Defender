// vector and collision math related helper functions go here

// rectangle to rectangle collision 
// takes in 2 box objects that have x/y positions, width, and height
export function rectangleCollision(box1, box2) {
  return (
    box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.height + box1.y > box2.y
  )
}

// angled rectangle collision (seperate axis theorem)

// rectangle to circle collision

// circle to circle collision

// vector scaling calculation
export function vectorScale(vector, newMagnitude) {
  const magnitude = Math.sqrt(vector[0]**2 + vector[1]**2);
  const scale = newMagnitude/magnitude;
  return [vector[0] * scale, vector[1] * scale]
}

// vector calculation between two points

// new angle calculation