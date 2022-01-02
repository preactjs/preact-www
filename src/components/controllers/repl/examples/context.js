const CounterContext = createContext(null);

function Counter() {
	const { count, increment } = useContext(CounterContext);

	return (
		<div style={{ background: '#eee', padding: '10px' }}>
			<p>Count: {count}</p>
			<button onClick={increment}>Add</button>
		</div>
	);
}

export default function App() {
	const [count, setCount] = useState(0);

	function increment() {
		setCount(count + 1);
	}

	const counter = useMemo(() => {
		return { count, increment };
	}, [count]);

	return (
		<CounterContext.Provider value={counter}>
			<div style={{ display: 'flex', gap: '20px' }}>
				<Counter />
				<Counter />
				<Counter />
			</div>
		</CounterContext.Provider>
	);
}
