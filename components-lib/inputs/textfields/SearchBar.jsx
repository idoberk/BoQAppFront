import styled from '@emotion/styled';
import TextField from './TextField';
import { Search as SearchIcon } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

const DefaultSearchBar = styled(TextField)`
	width: 75%;
`;

const SearchBar = ({ placeholder = 'Search...', ...props }) => {
	return (
		<DefaultSearchBar
			placeholder={placeholder}
			{...props}
			slotProps={{
				input: {
					startAdornment: (
						<InputAdornment position='start'>
							<SearchIcon />
						</InputAdornment>
					),
				},
			}}
		/>
	);
};

export default SearchBar;
