package kr.co.iei.admin.model.service;

import java.util.List;

import org.springframework.stereotype.Service;

import kr.co.iei.admin.model.dao.ProductCarbonDao;
import kr.co.iei.admin.model.vo.ProductCarbon;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductCarbonService {

	private final ProductCarbonDao productCarbonDao;
	
	public List<ProductCarbon> getCarbonList() {

		return productCarbonDao.selectAllCarbon();
	}

}
