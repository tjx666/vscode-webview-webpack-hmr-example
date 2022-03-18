import imgSrc from './xiaomai.gif';

export default function App() {
    return (
        <div className="app">
            <img
                src={imgSrc}
                style={{
                    display: 'block',
                    marginBottom: 20,
                }}
            />
            <button>Hello World</button>
        </div>
    );
}
