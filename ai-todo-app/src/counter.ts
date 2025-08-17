export function setupCounter(element: HTMLButtonElement) { // Function to set up a counter on a button element
  let counter = 0
  const setCounter = (count: number) => { // Function to update the counter and display it on the button
    counter = count
    element.innerHTML = `count is ${counter}`
  }
  element.addEventListener('click', () => setCounter(counter + 1)) // Increment the counter when the button is clicked
  setCounter(0) // Initialize the counter to 0
}
