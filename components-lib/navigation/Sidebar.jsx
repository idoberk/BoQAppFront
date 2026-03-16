import { useEffect, useRef, useState } from 'react';
import { Box, Divider } from '@mui/material';
import styled from '@emotion/styled';

const RESIZE_HANDLE_WIDTH = 6;
const DEFAULT_MAX_WIDTH = 400;

const SidebarRoot = styled(Box)`
	position: relative;
	height: 100%;
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	min-width: max-content;
	overflow: hidden;
	border-right: 2px solid ${({ theme }) => theme.palette.divider};
	//background-color: ${({ theme }) => theme.palette.sidebar.background};
`;

const ResizeHandle = styled(Box)`
	position: absolute;
	right: 0;
	top: 0;
	width: ${RESIZE_HANDLE_WIDTH}px;
	height: 100%;
	cursor: col-resize;
	z-index: 10;

	&::after {
		content: '';
		position: absolute;
		right: 0;
		top: 0;
		width: 2px;
		height: 100%;
		background-color: transparent;
		transition: background-color 0.2s;
	}

	&:hover::after,
	&.is-dragging::after {
		background-color: ${({ theme }) => theme.palette.primary.main};
	}
`;

const Sidebar = ({
	header,
	children,
	maxWidth = DEFAULT_MAX_WIDTH,
	contentGap = 24,
	...props
}) => {
	const [width, setWidth] = useState(null);
	const sidebarRef = useRef(null);
	const handleRef = useRef(null);
	const minWidthRef = useRef(0);

	useEffect(() => {
		if (sidebarRef.current) {
			minWidthRef.current =
				sidebarRef.current.getBoundingClientRect().width;
		}
	}, []);

	const handleMouseDown = (e) => {
		e.preventDefault();

		document.body.style.userSelect = 'none';
		document.body.style.cursor = 'col-resize';
		handleRef.current?.classList.add('is-dragging');

		const startX = e.clientX;
		const startWidth =
			sidebarRef.current?.getBoundingClientRect().width ??
			minWidthRef.current;

		const onMouseMove = (moveEvent) => {
			const delta = moveEvent.clientX - startX;
			const next = Math.min(
				maxWidth,
				Math.max(minWidthRef.current, startWidth + delta),
			);
			setWidth(next);
		};

		const onMouseUp = () => {
			document.body.style.userSelect = '';
			document.body.style.cursor = '';
			handleRef.current?.classList.remove('is-dragging');
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onMouseUp);
		};

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	};
	return (
		<SidebarRoot
			ref={sidebarRef}
			style={width !== null ? { width: `${width}px` } : undefined}
			{...props}
		>
			{header ? (
				<>
					<Box sx={{ px: 2, py: 1.5 }}>{header}</Box>
					<Divider />
				</>
			) : null}

			<Box
				sx={{
					flex: 1,
					overflowY: 'auto',
					overflowX: 'hidden',
					py: 1,
					pr: `${contentGap}px`,
				}}
			>
				{children}
			</Box>

			<ResizeHandle
				ref={handleRef}
				onMouseDown={handleMouseDown}
			/>
		</SidebarRoot>
	);
};

export default Sidebar;
