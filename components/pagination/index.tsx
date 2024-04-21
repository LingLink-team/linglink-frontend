import React from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationEllipsis } from '@/components/ui/pagination';
import { Button } from '../ui/button';
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (pageNumber: number) => void;
};

export const CustomPagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <Button variant="outline" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
                        <MdOutlineArrowBackIosNew />
                    </Button>
                </PaginationItem>

                {/* Hiển thị trang đầu tiên */}
                <PaginationItem>
                    <Button variant="outline" disabled={currentPage === 1} onClick={() => onPageChange(1)}>
                        1
                    </Button>
                </PaginationItem>

                {/* Hiển thị trang trước trang hiện tại nếu có */}
                {currentPage > 2 && (
                    <PaginationItem>
                        <Button variant="outline" onClick={() => onPageChange(currentPage - 1)}>
                            {currentPage - 1}
                        </Button>
                    </PaginationItem>
                )}

                {/* Hiển thị trang hiện tại */}
                {currentPage !== 1 && currentPage !== totalPages && (
                    <PaginationItem>
                        <Button variant="outline">
                            {currentPage}
                        </Button>
                    </PaginationItem>
                )}

                {/* Hiển thị trang sau trang hiện tại nếu có */}
                {currentPage < totalPages - 1 && (
                    <PaginationItem>
                        <Button variant="outline" onClick={() => onPageChange(currentPage + 1)}>
                            {currentPage + 1}
                        </Button>
                    </PaginationItem>
                )}

                {/* Hiển thị trang cuối cùng */}
                {totalPages > 1 && (
                    <PaginationItem>
                        <Button variant="outline" disabled={currentPage === totalPages} onClick={() => onPageChange(totalPages)}>
                            {totalPages}
                        </Button>
                    </PaginationItem>
                )}
                {
                    currentPage < totalPages && <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                }

                <PaginationItem>
                    <Button disabled={currentPage >= totalPages} variant="outline" onClick={() => onPageChange(currentPage + 1)}>
                        <MdOutlineArrowForwardIos />
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

