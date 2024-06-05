import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
export default function ImageSlider({ images }) {
    return (
        <Carousel style={{ width: "clamp(200px, 50%, 500px)" }}>
            {images.map((image, index) => (
                <Carousel.Item key={index} interval={1500}>
                    <img
                        className="d-block w-100"
                        src={image}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

