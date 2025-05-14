
// // }

import Link from "next/link";



// export default function FixedBtn() {
//     const calculateTotal = () => {
//       // Mocked calculation for demonstration
//       return 23.0.toFixed(2); // Replace with actual logic if needed
//     };
  
//     const handleAddToCart = () => {
//       console.log('Add to cart');
//     };
  
//     return (
//       <div className="fixed-btn-container">
//         <div className="fixed-btn-flx">
//           <div className="fixed-btn-total">
//             <p className="fixed-btn-p1">Total Price</p>
//             <p className="fixed-btn-p2">${calculateTotal()}</p>
//           </div>
//           <button onClick={handleAddToCart} className="fixed-btn">
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     );
//   }


export default function FixedBtn({ price, onAddToCart,name,link }) {
  console.log(link)
  console.log("btn")
  return (
    <div className="fixed-btn-container">
      <div className="fixed-btn-flx">
        <div className="fixed-btn-total">
          <p className="fixed-btn-p1">Total Price</p>
          {/* <p className="fixed-btn-p2">£{price.toFixed(2)|| 0}</p> */}
  <p className="fixed-btn-p2">
  £{Number(price || 0).toFixed(2)}
</p>
        </div>
        <Link href={link}>
        <button onClick={onAddToCart} className="fixed-btn">
          {name}
        </button>
        
    </Link>
      </div>
    </div>
  );
}


  