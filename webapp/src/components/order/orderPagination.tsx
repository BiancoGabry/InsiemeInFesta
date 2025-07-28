import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Page } from "@/types/page";

interface OrderPaginationProps {
  page: Page
  index: number,
  setIndex: React.Dispatch<React.SetStateAction<number>>,
}

export default function OrderPagination({ page, index, setIndex }: OrderPaginationProps) {

  function handleNext() {
    if (!page.nextPage) return;
    setIndex(page.nextPage);
  }

  function handlePrevious() {
    if (!page.prevPage) return;
    setIndex(page.prevPage);
  }

  function handleIndex(goToIndex: number | null){
    if(!goToIndex) return;
    setIndex(goToIndex);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={() => handlePrevious()} />
        </PaginationItem>
        {
          page.hasPrevPage ?
            <PaginationItem>
              <PaginationLink href="#" onClick={() => handleIndex(page.prevPage)}>{page.prevPage}</PaginationLink>
            </PaginationItem>
            : <></>
        }

        <PaginationItem>
          <PaginationLink href="#" isActive>{index}</PaginationLink>
        </PaginationItem>

        {
          page.nextPage ?
            <PaginationItem>
              <PaginationLink href="#" onClick={() => handleIndex(page.nextPage)}>{page.nextPage}</PaginationLink>
            </PaginationItem>
            : <></>
        }
        <PaginationItem >
          <PaginationNext href="#" onClick={() => handleNext()} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}