// vector and collision math related helper functions go here
// rectangle to rectangle collision 
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

// new angle calculation