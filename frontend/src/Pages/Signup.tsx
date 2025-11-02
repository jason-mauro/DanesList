import SignupScreen from "../Components/SignupSideBar";
import {
  LampDesk, Armchair, Table, Laptop, Shirt, Camera, Headphones, Gamepad2,
  Calculator, Book, Pencil, Pen, Backpack, Bike, Ticket, Coffee, Keyboard,
  Guitar, Volleyball, ShoppingBasket, Phone, PcCase, Microwave
} from 'lucide-react';
import { useMemo } from 'react';

const Signup = () => {
  const iconComponents = [
    LampDesk, Armchair, Table, Laptop, Shirt, Camera, Headphones, Gamepad2,
    Calculator, Book, Pencil, Pen, Backpack, Bike, Ticket, Coffee, Keyboard,
    Guitar, Volleyball, ShoppingBasket, Phone, PcCase, Microwave
  ];

  const backgroundIcons = useMemo(() => {
    const icons = [];
    const rows = 10;
    const iconsPerRow = 12;

    for (let row = 0; row < rows; row++) {
      const rowIcons = [];
      for (let col = 0; col < iconsPerRow; col++) {
        rowIcons.push({
          id: `${row}-${col}`,
          Icon: iconComponents[Math.floor(Math.random() * iconComponents.length)],
          rotation: row % 2 === 0 ? 30 : -30,
          opacity: 0.9,
        });
      }
      icons.push(rowIcons);
    }
    return icons;
  }, []);

  return (
    <>
    <div className="bg-white relative min-h-screen flex items-center justify-center overflow-hidden">
    <div className="position-relative min-vh-100 d-flex align-items-center justify-content-center bg-gradient overflow-hidden" >
      
      {/* Background Icons */}
      <div className="position-absolute top-0 start-0 w-100 h-100 p-4 z-0">
        <div className="container-fluid h-100">
          {backgroundIcons.map((row, rowIndex) => (
            <div key={rowIndex} className="row g-0" style={{ height: '10%' }}>
              {row.map(({ id, Icon, rotation, opacity }) => (
                <div key={id} className="col-1 d-flex align-items-center justify-content-center">
                  <Icon
                    style={{
                      width: '35px',
                      height: '35px',
                      transform: `rotate(${rotation}deg)`,
                      opacity: opacity,
                      color: '#A2799A',
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Centered Signup Form */}
      <div className="flex bg-transparent d-flex justify-content-center align-items-center z-1">
        <SignupScreen />
      </div>
    </div>
    </div>
    </>
  );
}

export default Signup;
