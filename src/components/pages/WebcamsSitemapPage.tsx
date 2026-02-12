import * as React from 'react';
import { useState, useEffect } from 'react';
import {
	Col, Container, Row, Pagination, PaginationItem, PaginationLink
} from 'reactstrap';
import { useSearchParams } from 'react-router-dom';

import webcams from '../../webcams';
import { Webcam } from '../../types/webcam';
import PopupContent from '../parts/PopupContent';

function WebcamsSitemapPage() {
	const itemsPerPage = 9; // For a 3x3 grid
	const totalPages = Math.ceil(webcams.length / itemsPerPage);

	// Use URL search parameters to get the current page
	const [searchParams, setSearchParams] = useSearchParams();
	const pageParameter = searchParams.get('page');
	const [currentPage, setCurrentPage] = useState(
		pageParameter ? Number.parseInt(pageParameter, 10) : 1
	);
	const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

	// Update the URL whenever the current page changes
	useEffect(() => {
		setSearchParams({ page: safeCurrentPage.toString() });
	}, [safeCurrentPage, setSearchParams]);

	// Calculate the indices for slicing the webcams array
	const indexOfLastWebcam = safeCurrentPage * itemsPerPage;
	const indexOfFirstWebcam = indexOfLastWebcam - itemsPerPage;
	const currentWebcams = webcams.slice(indexOfFirstWebcam, indexOfLastWebcam);

	// Map the current webcams to JSX elements
	const webcamTiles = currentWebcams.map((webcam: Webcam) => (
		<Col key={webcam.osmID} lg={4} md={4} sm={12}>
			<PopupContent webcam={webcam} />
		</Col>
	));

	useEffect(() => {
		document.title = 'Webcam - CartoCams';
	}, []);

	// Function to handle page changes
	const handlePageChange = (pageNumber: number) => {
		setCurrentPage(Math.min(Math.max(pageNumber, 1), totalPages));
	};

	// Generate pagination items
	const pageNumbers: (number | '...')[] = [];

	// Determine start and end pages around the current page
	const paginationLookup = {
		1: [1, 2, 3, 4, '...', totalPages],
		2: [1, 2, 3, 4, '...', totalPages],
		3: [1, 2, 3, 4, '...', totalPages],
		[totalPages]: [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages],
		[totalPages - 1]: [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages],
		[totalPages - 2]: [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
	} as const;

	if (paginationLookup[safeCurrentPage]) {
		pageNumbers.push(...paginationLookup[safeCurrentPage]);
	} else {
		pageNumbers.push(1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages);
	}

	const paginationItems = [];
	// Create PaginationItems
	for (const [index, pageNumber] of pageNumbers.entries()) {
		if (pageNumber === '...') {
			paginationItems.push(
				<PaginationItem key={pageNumber + index} disabled>
					<PaginationLink>...</PaginationLink>
				</PaginationItem>
			);
		} else {
			paginationItems.push(
				<PaginationItem key={pageNumber} active={pageNumber === safeCurrentPage}>
					<PaginationLink onClick={() => handlePageChange(pageNumber)}>
						{pageNumber}
					</PaginationLink>
				</PaginationItem>
			);
		}
	}

	return (
		<Container fluid>
			<Row>
				<Col md={6}>
					<h1>All Webcams</h1>
				</Col>
			</Row>
			<Row>{webcamTiles}</Row>
			<Row>
				<Col>
					<Pagination aria-label="Webcam pagination">
						<PaginationItem disabled={safeCurrentPage <= 1}>
							<PaginationLink previous onClick={() => handlePageChange(safeCurrentPage - 1)} />
						</PaginationItem>
						{paginationItems}
						<PaginationItem disabled={safeCurrentPage >= totalPages}>
							<PaginationLink next onClick={() => handlePageChange(safeCurrentPage + 1)} />
						</PaginationItem>
					</Pagination>
				</Col>
			</Row>
		</Container>
	);
}

export default WebcamsSitemapPage;
