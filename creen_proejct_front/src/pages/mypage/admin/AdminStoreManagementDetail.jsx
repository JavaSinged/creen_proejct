import React, { useEffect, useState } from "react";
import styles from "./AdminStoreManagementDetail.module.css";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

const AdminStoreManagementDetail = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const { storeId } = useParams();
  const backHost = import.meta.env.VITE_BACKSERVER;
  const [orderList, setOrderList] = useState([{}]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // 모달 상태 관리
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  //페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const filteredList = orderList.filter((item) =>
    item.storeName?.toLowerCase().includes(searchKeyword.toLowerCase()),
  );
  console.log("🚀 ~ AdminStoreManagementDetail ~ filteredList:", filteredList);
  const totalPages = Math.ceil(orderList.length / itemsPerPage);
  const [pageGroup, setPageGroup] = useState(0);
  const pageLimit = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const sortedList = [...filteredList].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // 주문번호 정렬
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    // 가격 정렬
    return sortConfig.direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });
  const currentOrders = sortedList.slice(indexOfFirstItem, indexOfLastItem);
  const startPage = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1;

  const endPage = Math.min(startPage + pageLimit - 1, totalPages);

  // 페이지 이동 핸들러
  const handlePrevGroup = () => {
    if (pageGroup > 0) {
      setPageGroup(pageGroup - 1);
      setCurrentPage((pageGroup - 1) * pageLimit + 1);
    }
  };
  const handleNextGroup = () => {
    const maxGroup = Math.floor((totalPages - 1) / pageLimit);

    if (pageGroup < maxGroup) {
      setPageGroup(pageGroup + 1);
      setCurrentPage((pageGroup + 1) * pageLimit + 1);
    }
  };
  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  ///////////

  const statusMap = {
    0: "결제대기",
    1: "접수대기",
    2: "주문접수",
    3: "조리중",
    4: "배달중",
    5: "배달완료",
    9: "주문취소",
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "결제대기":
        return { color: "#6b7280", backgroundColor: "#f3f4f6" };
      case "접수대기":
        return { color: "#6366f1", backgroundColor: "#eef2ff" };
      case "주문접수":
        return { color: "#3b82f6", backgroundColor: "#eff6ff" };
      case "조리중":
        return { color: "#06b6d4", backgroundColor: "#ecfeff" };
      case "배달중":
        return { color: "#f59e0b", backgroundColor: "#fff7e8" };
      case "배달완료":
        return { color: "#22c55e", backgroundColor: "#ecfdf3" };
      case "주문취소":
        return { color: "#ef4444", backgroundColor: "#fef2f2" };
      default:
        return {};
    }
  };

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/admin/${storeId}`)
      .then((res) => {
        setOrderList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // 모달 열기/닫기 핸들러
  const handleOpenDetailModal = (order) => {
    setSelectedOrder(order);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className={styles.content}>
      <Paper className={styles.card} elevation={0}>
        {/* 🔍 헤더 */}
        <Box className={styles.header}>
          <h2 className={styles.title}>주문 내역</h2>
        </Box>

        {/* 📊 테이블 */}
        <TableContainer>
          <Table>
            <TableHead className={styles.table_head}>
              <TableRow className={styles.headRow}>
                <TableCell>
                  <div
                    className={styles.headerCell}
                    onClick={() => handleSort("orderId")}
                  >
                    주문 번호 <UnfoldMoreIcon className={styles.sort_icon} />
                  </div>
                </TableCell>
                <TableCell>주문자</TableCell>
                <TableCell>상품</TableCell>
                <TableCell>
                  <div
                    className={styles.headerCell}
                    onClick={() => handleSort("totalPrice")}
                  >
                    금액
                    <UnfoldMoreIcon className={styles.sort_icon} />
                  </div>
                </TableCell>
                <TableCell>매장</TableCell>
                <TableCell>상태</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {currentOrders.map((item) => (
                <TableRow key={item.orderId} hover>
                  {/* 주문번호 */}
                  <TableCell className={styles.orderId}>
                    {item.orderId}
                  </TableCell>

                  {/* 주문자 */}
                  <TableCell>
                    <Box className={styles.infoBox}>
                      <Avatar src={item.memberThumb} />
                      <Box>
                        <p className={styles.mainText}>{item.memberId}</p>
                        <span className={styles.subText}>
                          {item.memberEmail}
                        </span>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* 상품 (클릭 시 모달 오픈) */}
                  <TableCell>
                    <Box
                      className={styles.infoBox}
                      onClick={() => handleOpenDetailModal(item)}
                      sx={{
                        cursor: "pointer",
                        padding: "8px",
                        borderRadius: "8px",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <img
                        src={
                          item.menuList?.[0]?.menuImage ||
                          "/image/default_menu.png"
                        }
                        className={styles.productImage}
                        alt="메뉴 이미지"
                      />
                      <Box>
                        <p className={styles.mainText}>
                          {item.menuList?.length > 0 && (
                            <>
                              {item.menuList[0].menuName}
                              {item.menuList.length > 1 &&
                                ` 외 ${item.menuList.length - 1}개`}
                            </>
                          )}
                        </p>
                        <span className={styles.subText}>
                          {item.optionString || "옵션 없음"}
                        </span>
                        <Typography
                          variant="caption"
                          color="primary"
                          sx={{ display: "block", mt: 0.5, fontWeight: "bold" }}
                        >
                          상세 보기 🔍
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* 금액 */}
                  <TableCell>{item.totalPrice?.toLocaleString()}원</TableCell>

                  {/* 매장 */}
                  <TableCell>{item.storeName}</TableCell>

                  {/* 상태 */}
                  <TableCell>
                    <Chip
                      label={statusMap[item.orderStatus] || "알수없음"}
                      size="small"
                      sx={{
                        ...getStatusStyle(statusMap[item.orderStatus]),
                        fontWeight: 700,
                        borderRadius: "999px",
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 페이지네이션 영역 */}
        <div className={styles.pagination}>
          <button
            className={styles.page_btn_nav}
            onClick={handlePrevGroup}
            disabled={pageGroup === 0}
          >
            <ChevronLeftIcon fontSize="small" />
            이전
          </button>

          <div className={styles.page_numbers}>
            {Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i,
            ).map((num) => (
              <div
                key={num}
                className={`${styles.page_num} ${
                  currentPage === num ? styles.active : ""
                }`}
                onClick={() => setCurrentPage(num)}
              >
                {String(num).padStart(2, "0")}
              </div>
            ))}
          </div>

          <button
            className={styles.page_btn_nav}
            onClick={handleNextGroup}
            disabled={endPage === totalPages}
          >
            다음
            <ChevronRightIcon fontSize="small" />
          </button>
        </div>
      </Paper>

      {/* 🚀 주문 상세 보기 모달 */}
      <Dialog
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: "12px" } }}
      >
        <DialogTitle
          sx={{ fontWeight: "bold", borderBottom: "1px solid #eee" }}
        >
          주문 상세 내역
          {selectedOrder && (
            <Typography variant="subtitle2" color="text.secondary">
              주문 번호: {selectedOrder.orderId}
            </Typography>
          )}
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {selectedOrder?.menuList?.length > 0 ? (
            selectedOrder.menuList.map((menu, idx) => (
              <Box
                key={idx}
                sx={{ display: "flex", mb: 2.5, alignItems: "center" }}
              >
                <Avatar
                  src={menu.menuImage || "/image/default_menu.png"}
                  variant="rounded"
                  sx={{ width: 64, height: 64, mr: 2 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {menu.menuName}{" "}
                    <span style={{ color: "#22c55e", fontSize: "0.9em" }}>
                      x {menu.quantity || 1}
                    </span>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {/* 메뉴별 개별 옵션이 있다면 그걸 쓰고, 없다면 전체 옵션 텍스트 표시 */}
                    {menu.options ||
                      (idx === 0 ? selectedOrder.optionString : "") ||
                      "옵션 없음"}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {(menu.menuPrice || 0).toLocaleString()}원
                </Typography>
              </Box>
            ))
          ) : (
            <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
              메뉴 상세 정보가 없습니다.
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              총 결제 금액
            </Typography>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold" }}
            >
              {selectedOrder?.totalPrice?.toLocaleString() || 0}원
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={handleCloseDetailModal}
            variant="contained"
            disableElevation
            sx={{ width: "100%", borderRadius: "8px", py: 1.5 }}
          >
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminStoreManagementDetail;
