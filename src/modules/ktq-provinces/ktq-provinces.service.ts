import { AutocompleteKtqAddressDto } from '@/common/dtos/ktq-provinces.dto';
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqCountry from '@/entities/ktq-countries.entity';
import KtqDistrict from '@/entities/ktq-districts.entity';
import KtqProvince from '@/entities/ktq-provinces.entity';
import KtqWard from '@/entities/ktq-wards.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { plainToClass } from 'class-transformer';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { KtqCachesService } from '../ktq-caches/services/ktq-caches.service';
import { KtqAddressesService } from '../ktq-addresses/ktq-addresses.service';

@Injectable()
export class KtqProvincesService {
    private url_sync = 'https://provinces.open-api.vn/api/';

    constructor(
        @InjectRepository(KtqProvince)
        private readonly ktqProvincesRepo: Repository<KtqProvince>,
        @InjectRepository(KtqWard)
        private readonly ktqWardRepo: Repository<KtqWard>,
        @InjectRepository(KtqDistrict)
        private readonly ktqDistrictRepo: Repository<KtqDistrict>,
        @InjectRepository(KtqCountry)
        private readonly ktqCountryRepo: Repository<KtqCountry>,
    ) {}

    async findOneWith(options?: FindManyOptions<KtqProvince>) {
        return await this.ktqProvincesRepo.findOne(options);
    }

    async findWith(options?: FindManyOptions<KtqProvince>) {
        return await this.ktqProvincesRepo.find(options);
    }

    async initProvinces() {
        try {
            const response = await axios.get(`${this.url_sync}p/`);

            // Sử dụng Set và Map để đảm bảo các tỉnh duy nhất dựa trên mã code
            const uniqueProvinces = [
                ...new Set(
                    response.data.map((item: KtqProvince) => item.code), // Lấy mã code làm căn cứ để so sánh
                ),
            ]
                .map((code) => {
                    return response.data.find((item: KtqProvince) => item.code === code); // Tìm tỉnh duy nhất theo code
                })
                .filter((item) => item !== undefined); // Loại bỏ các giá trị không hợp lệ nếu có

            // Lưu vào cơ sở dữ liệu
            await this.ktqProvincesRepo.save(uniqueProvinces);
        } catch (error) {
            console.log('init provinces', error);
        }
    }

    async initDistricts() {
        try {
            const response = await axios.get(`${this.url_sync}d/`);

            const districts: KtqDistrict[] = [];

            for (let index = 0; index < response.data.length; index++) {
                const item = response.data[index];

                const province = await this.ktqProvincesRepo.findOne({
                    where: { code: item.province_code },
                });

                districts.push({
                    id: item.code,
                    province: {
                        ...province,
                    },
                    ...item,
                } as KtqDistrict);
            }

            await this.ktqDistrictRepo.save(districts);
        } catch (error) {
            console.log('init districts', error);
        }
    }

    async initWards() {
        try {
            const response = await axios.get(`${this.url_sync}w/`);

            const wards: KtqWard[] = [];

            for (let index = 0; index < response.data.length; index++) {
                const item = response.data[index];

                const district = await this.ktqDistrictRepo.findOne({
                    where: { code: item.district_code },
                });

                wards.push({
                    id: index + 1,
                    district: district,
                    ...item,
                } as KtqWard);
            }

            await this.ktqWardRepo.save(wards);
        } catch (error) {
            console.log('init wards', error);
        }
    }

    async initCountries() {
        const countries: KtqCountry[] = [
            {
                id: 1,
                country_name: 'Việt Nam',
                country_code: '+84',
                created_at: new Date(),
                updated_at: new Date(),
                regions: [],
                addresses: [],
            },
        ];

        await this.ktqCountryRepo.save(countries);
    }

    async syncToDb() {
        await this.initProvinces();
        await this.initDistricts();
        await this.initWards();

        await this.initCountries();

        return KtqResponse.toResponse(true);
    }

    async provinces(search?: string) {
        const provincesData = await this.ktqProvincesRepo.find({
            where: {
                name: search ? Like(`%${search}%`) : search,
            },
        });

        return KtqResponse.toResponse(plainToClass(KtqProvince, provincesData));
    }

    async district(province_code?: KtqProvince['code'], province_name?: string, search?: string) {
        const districtsData = await this.ktqDistrictRepo.find({ where: { province_code, name: search ? Like(`%${search}%`) : search, province: { name: province_name } } });

        return KtqResponse.toResponse(plainToClass(KtqDistrict, districtsData));
    }

    async wards(district_code: KtqDistrict['code'], province_name?: string, district_name?: string, search?: string) {
        const wardsData = await this.ktqWardRepo.find({
            where: { district_code, name: search ? Like(`%${search}%`) : search, district: { name: district_name, province: { name: province_name } } },
        });

        return KtqResponse.toResponse(plainToClass(KtqWard, wardsData));
    }

    async countries(search?: string) {
        const countriesData = await this.ktqCountryRepo.find({ where: { country_name: search ? Like(`%${search}%`) : search } });

        return KtqResponse.toResponse(plainToClass(KtqWard, countriesData));
    }
}
