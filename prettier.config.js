export default {
  // 플러그인 설정
  plugins: [
    "@trivago/prettier-plugin-sort-imports", // import 문 정렬
    "prettier-plugin-tailwindcss", // Tailwind 클래스 정렬
  ],

  // 기본 포맷팅 규칙
  bracketSpacing: true, // 객체 중괄호 내 공백 { foo: bar }
  semi: false, // 세미콜론 미사용
  singleQuote: false, // 큰따옴표 사용
  tabWidth: 2, // 들여쓰기 2칸
  trailingComma: "es5", // ES5 호환 trailing comma

  // Import 정렬 규칙
  importOrder: [
    "^react$", // 1. React를 최상단에
    "<THIRD_PARTY_MODULES>", // 2. 외부 라이브러리
    "^[@]+/", // 3. @로 시작하는 alias 경로
    "^[.]+/", // 4. 상대 경로 import
  ],
  importOrderSeparation: true, // 그룹 간 빈 줄 추가
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
}
