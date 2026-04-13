package kr.co.iei.admin.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.co.iei.admin.model.vo.ProductCarbon;

@Mapper
public interface ProductCarbonDao {

	List<ProductCarbon> selectAllCarbon();

	Integer updateContainer(ProductCarbon product);

	Integer insertContainer(ProductCarbon product);

	Integer deleteCarbon(Integer productId);

}
