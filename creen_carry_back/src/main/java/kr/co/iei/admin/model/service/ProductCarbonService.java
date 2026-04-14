package kr.co.iei.admin.model.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import kr.co.iei.admin.model.dao.ProductCarbonDao;
import kr.co.iei.admin.model.vo.ProductCarbon;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductCarbonService {

	private final ProductCarbonDao productCarbonDao;
	// 불러오기 로직
	public List<ProductCarbon> getCarbonList() {
		return productCarbonDao.selectAllCarbon();
	}
	
	//용기 정보 저장
	@Transactional
	public Integer saveContainer(ProductCarbon product) {
		if(product.getProductId() != null) {
			//수정
			return productCarbonDao.updateContainer(product);
		}else {
			//등록
			return productCarbonDao.insertContainer(product);
		}
	}
	//삭제
	public Integer deleteCarbon(Integer productId) {
		return productCarbonDao.deleteCarbon(productId);
	}

	public Integer saveContainer(ProductCarbon product, MultipartFile uploadFile) {
		return null;
	}
}
