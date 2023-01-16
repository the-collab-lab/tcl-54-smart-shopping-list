import './Home.css';
import { generateToken } from '@the-collab-lab/shopping-list-utils';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home({ listToken, setListToken }) {
	const navigate = useNavigate();

	useEffect(() => {
		if (listToken) {
			navigate('/list');
		}
	});

	function createNewToken() {
		setListToken(generateToken());
		navigate('/list');
	}

	return (
		<div className="Home">
			<p>
				Hello from the home (<code>/</code>) page!
			</p>
			<button onClick={createNewToken}>Create a new list</button>
		</div>
	);
}
